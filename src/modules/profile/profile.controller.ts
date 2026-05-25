import { Request, Response } from "express";
import { createProfilesFromJobService } from "./profile.service";

export const createProfilesFromJob = async (req: Request, res: Response) => {
  try {
    const { jobId, texts } = req.body;

    if (!jobId || !texts || !Array.isArray(texts)) {
      return res.status(400).json({
        message: "jobId and texts[] required",
      });
    }

    const profiles = await createProfilesFromJobService(jobId, texts);

    return res.json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

import { matchProfileWithJob } from "../services/matching.service";

export const runProfileMatching = async (req: Request, res: Response) => {
  try {
    const profileId = req.params.id as string;

    const result = await matchProfileWithJob(profileId);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};