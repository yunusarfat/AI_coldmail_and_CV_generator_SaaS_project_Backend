import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
// import path from "path";
import cloudinary from "../../config/cloudinary";

// import fs from "fs";

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

  // AI tailoring
  const tailoredData = await generateTailoredCV(
    profile,
    job
  );

  // Build HTML
  const html = buildCVTemplate({
    ...tailoredData,
    name: profile.name,
  });

  // Launch browser
  // const browser = await puppeteer.launch({
  //   args: chromium.args,
  //   executablePath: await chromium.executablePath(),
  //   headless: true,
  // });
  const isProduction = process.env.NODE_ENV === "production";

const browser = await puppeteer.launch(
  isProduction
    ? {
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      }
    : {
        headless: true,
      }
);

  const page = await browser.newPage();

  await page.setContent(html);

  // // Ensure folder exists
  // const dir = path.join(process.cwd(), "generated-cvs");

  // if (!fs.existsSync(dir)) {
  //   fs.mkdirSync(dir);
  // }

  // const fileName = `cv-${Date.now()}.pdf`;

  // const filePath = path.join(dir, fileName);

  // Generate PDF
  // await page.pdf({
  //   path: filePath,
  //   format: "A4",
  //   printBackground: true,
  // });

  const buffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  const uploadResult = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "generated-cvs",
        resource_type: "raw",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
  
    stream.end(buffer);
  });

  await browser.close();

  // Save DB
  const cv = await CV.create({
    userId,
    profileId,
    jobId,
    pdfUrl: uploadResult.secure_url,
    tailoredData,
  });

  await deductCredits(userId, 2);
  return cv;
};

export const getAllCVsService = async (userId: string) => {
  return await CV.find(
    {
      userId
    }
  ).sort({ createdAt: -1 })

}


export const deleteCVService = async (userId: string, cvId: string) => {

  const cv = await CV.findOne(
    {
      _id: cvId,
      userId,

    }
  )
  if(!cv)
  {
    throw new Error("not found")
  }
  // if (cv.pdfUrl) {
  //   const filePath = path.join(
  //     process.cwd(),
  //     cv.pdfUrl
  //   );

  //   if (fs.existsSync(filePath)) {
  //     fs.unlinkSync(filePath);
  //   }
  // }

  await CV.findByIdAndDelete(cvId);

  return {
    message: "CV deleted successfully",
  };



}