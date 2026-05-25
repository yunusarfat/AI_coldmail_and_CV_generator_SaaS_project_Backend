// import { Request, Response } from "express";


// import {
//     createJobService,
//     getUserJobsService,
//     getJobByIdService,
// } from "./job.service";


// export const createJob = async (req: Request, res: Response) => {
//     try {
//         const userId = (req as any).user.id;
//         const { title, desiredPost } = req.body;
//         if (!desiredPost) {
//             return res.status(400).json(
//                 {
//                     message: "desiredpost is needed"
//                 }
//             )
//         }
//         const job = await createJobService(
//             {
//                 userId,
//                 title,
//                 desiredPost,
//             })
//         return res.status(201).json(
//             {
//                 message: "You created new job",
//                 job,
//             }
//         )

//     }
//     catch (err) {
//         return res.status(500).json(
//             {
//                 message: "server error", err
//             }
//         )

//     }

// }

// export const getMyJobs = async (req: Request, res: Response) => {
//     try {
//         const userId = (req as any).user.id;
//         const jobs = await getUserJobsService(userId);
//         return res.status(200).json(
//             {
//                 message: "fetched sucessfully",
//                 jobs,

//             }
//         )

//     }
//     catch (err) {
//         return res.status(500).json(
//             {
//                 message: "server error", err
//             }
//         )

//     }
// }

// export const getJobById = async (req: Request, res: Response) => {
//     try {
//         const userId = (req as any).user.id;
//         const jobId = req.params.id as string;
//         const job = await getJobByIdService(jobId, userId);
//         if (!job) {
//             return res.status(404).json(
//                 {
//                     message: "Job not found"
//                 }
//             )
//         }
//         return res.status(200).json(
//             {
//                 message: "job fetched successfully",
//                 job
//             }
//         )

//     }
//     catch (err) {
//         return res.status(500).json(
//             {
//                 message: "error", err
//             }
//         )

//     }
// }