// import { Job } from "./job.model";


// interface CreateJobInput {
//     userId: string;
//     title?: string;
//     desiredPost: string;

// }

// export const createJobService = async (data: CreateJobInput) => {
//     const job = await Job.create(
//         {
//             userId: data.userId,
//             title: data.title || "New compaign",
//             desiredPost: data.desiredPost,
//             status: "pending",
//         }
//     )
//     return job;
// }

// export const getUserJobsService = async (userId: string) => {
//     const jobs = await Job.find({ userId }).sort({ createId: -1 });
//     return jobs;

// }

// export const getJobByIdService = async (jobId: string, userId: string) => {

//     const job = await Job.findOne({
//         _id: jobId, userId
//     })
//     return job;
// }


