import mongoose from "mongoose";
import { Email } from "./email.model";
import { Profile } from "../profile/profile.model";
import { dJob } from "../djob/job.model";
import { matchProfileWithJob } from "../services/matching.service";
import { generateColdEmailAI } from "./email.ai";
import { deductCredits } from "../../utils/credit.utils";


export const generateEmailService = async (
  userId: string,
  profileId: string,
  tone: string = "professional"
) => {
  // Get Profile
  const profile = await Profile.findById(profileId);

  if (!profile) {
    throw new Error("Profile not found");
  }

  // Get Related Job
  const job = await dJob.findOne({
    userId,
  });

  if (!job) {
    throw new Error("Job not found");
  }

  // Match Result
  const matchResult = await matchProfileWithJob(profileId);

  // AI Generate Email
  const aiResult = await generateColdEmailAI(
    job.jobAnalysis,
    profile,
    matchResult,
    tone
  );

  // Save Email
  const email = await Email.create({
    userId: new mongoose.Types.ObjectId(userId),

    jobId: job._id,

    profileId: profile._id,

    subject: aiResult.subject,

    content: aiResult.content,

    tone,

    status: "draft",
  });

  await deductCredits(userId, 1);
  return email;
};





export const getAllEmailsService = async (userId: string) => {
  return await Email.find({ userId })
    .populate("profileId")
    .populate("jobId")
    .sort({ createdAt: -1 });
};





export const getSingleEmailService = async (
  userId: string,
  emailId: string
) => {
  return await Email.findOne({
    _id: emailId,
    userId,
  })
    .populate("profileId")
    .populate("jobId");
};

export const deleteEmailService = async (

    userId: string,
    emailId: string
  ) => {
    const email = await Email.findOneAndDelete({
      _id: emailId,
      userId,
    });
  
    if (!email) {
      throw new Error("Email not found");
    }
  
    return email;
  };

