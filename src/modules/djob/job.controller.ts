import { Request, Response } from "express";


// import {
//   createJobService,
//   getAllJobsService,
//   getSingleJobService,
// } from "./job.service";
import {
  createJobService,
  getUserJobsService,
  getJobByIdService,
} from "./job.service";

export const createJobController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;

    const { title, desiredPost } = req.body;

    if (!desiredPost) {
      return res.status(400).json({
        success: false,
        message: "desiredPost is required",
      });
    }

    const job = await createJobService({
      userId: user.id,
      title,
      desiredPost,
    });

    res.status(201).json({
      success: true,
      job,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllJobsController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;

    const jobs = await getUserJobsService(user.id);

    res.json({
      success: true,
      jobs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleJobController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;

    const job = await getJobByIdService(req.params.id as string, user.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      job,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};