// import mongoose from "mongoose";
// import { dJob } from "./job.model";
// import { analyzeJobWithAI } from "./job.ai";

// interface CreateJobInput {
//   userId: string;
//   title?: string;
//   desiredPost: string;
// }

// export const createJobService = async ({
//   userId,
//   title,
//   desiredPost,
// }: CreateJobInput) => {
//   const session = await mongoose.startSession();

//   session.startTransaction();

//   try {
//     // STEP 1 → create raw job
//     const job = await dJob.create(
//       [
//         {
//           userId,
//           title,
//           desiredPost,
//           status: "processing",
//         },
//       ],
//       { session }
//     );

//     const createdJob = job[0];

//     // STEP 2 → AI Analysis
//     const analysis = await analyzeJobWithAI(desiredPost);

//     // STEP 3 → save analysis
//     createdJob.jobAnalysis = analysis;

//     createdJob.status = "ready";

//     await createdJob.save({ session });

//     await session.commitTransaction();

//     return createdJob;
//   } catch (error) {
//     await session.abortTransaction();

//     throw error;
//   } finally {
//     session.endSession();
//   }
// };

// export const getAllJobsService = async (userId: string) => {
//   return await dJob.find({ userId }).sort({ createdAt: -1 });
// };

// export const getSingleJobService = async (
//   jobId: string,
//   userId: string
// ) => {
//   return await dJob.findOne({
//     _id: jobId,
//     userId,
//   });
// };



import { dJob } from "./job.model";
import { analyzeJobWithAI } from "./job.ai";


interface CreateJobInput {
  userId: string;
  title?: string;
  desiredPost: string;
}

export const createJobService = async (data: CreateJobInput) => {
  // 1. Create job first
  const job = await dJob.create({
    userId: data.userId,
    title: data.title || "New Campaign",
    desiredPost: data.desiredPost,
    status: "processing",
  });

  // 2. Run AI analysis
  const jobAnalysis = await analyzeJobWithAI(data.desiredPost);

  // 3. Update job with AI result
  job.jobAnalysis = jobAnalysis;
  job.status = "ready";

  await job.save();

  return job;
};

export const getUserJobsService = async (userId: string) => {
  const jobs = await dJob.find({ userId }).sort({ createdAt: -1 });
  return jobs;
};

export const getJobByIdService = async (jobId: string, userId: string) => {
  const job = await dJob.findOne({ _id: jobId, userId });
  return job;
};


