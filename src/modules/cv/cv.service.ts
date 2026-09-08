import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import cloudinary from "../../config/cloudinary";

import { Profile } from "../profile/profile.model";
import { dJob } from "../djob/job.model";

import { generateTailoredCV } from "./cv.ai";
import { buildCVTemplate } from "./cv.template";
import { deductCredits } from "../../utils/credit.utils";

import { CV } from "./cv.model";

export const generateCVService = async (
  userId: string,
  profileId: string,
  jobId: string
) => {
  const profile = await Profile.findById(profileId);

  if (!profile) {
    throw new Error("Profile not found");
  }

  const job = await dJob.findById(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  const tailoredData = await generateTailoredCV(profile, job);

  const html = buildCVTemplate({
    ...tailoredData,
    name: profile.name,
  });

  const isProduction = process.env.NODE_ENV === "production";

  const browser = await puppeteer.launch(
    isProduction
      ? {
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: true,
        }
      : {
          channel: "chrome",
          headless: true,
        }
  );

  const page = await browser.newPage();
  await page.setContent(html);

  const buffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  const publicId = `cv-${Date.now()}`;

  const uploadResult = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "generated-cvs",
        resource_type: "raw",
        format: "pdf",
        public_id: publicId,
        type: "authenticated",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });

  await browser.close();

  // Signed URL so Cloudinary's raw-file access restriction doesn't 401
  const signedUrl = cloudinary.utils.private_download_url(
    uploadResult.public_id,
    "pdf",
    {
      resource_type: "raw",
      type: "authenticated",
    }
  );

  const cv = await CV.create({
    userId,
    profileId,
    jobId,
    pdfUrl: signedUrl,
    cloudinaryPublicId: uploadResult.public_id,
    tailoredData,
  });

  await deductCredits(userId, 2);
  return cv;
};

export const getAllCVsService = async (userId: string) => {
  return await CV.find({ userId }).sort({ createdAt: -1 });
};

export const deleteCVService = async (userId: string, cvId: string) => {
  const cv = await CV.findOne({ _id: cvId, userId });

  if (!cv) {
    throw new Error("CV not found");
  }

  if (cv.cloudinaryPublicId) {
    await cloudinary.uploader
      .destroy(cv.cloudinaryPublicId, { resource_type: "raw" })
      .catch((err) => console.log("Cloud delete failed:", err));
  }

  await CV.findByIdAndDelete(cvId);

  return {
    message: "CV deleted successfully",
    deletedId: cvId,
  };
};