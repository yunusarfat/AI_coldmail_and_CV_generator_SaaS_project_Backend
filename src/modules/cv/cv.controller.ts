import { Request, Response } from "express";

import { generateCVService, getAllCVsService, deleteCVService } from "./cv.service";

export const generateCVController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;

    const { profileId, jobId } = req.body;

    const cv = await generateCVService(
      user.id,
      profileId,
      jobId
    );

    res.json({
      success: true,
      cv,
    });
  } catch (error: any) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllCVsController = async (req: any, res: Response) => {
  try {
    const cvs = await getAllCVsService(
      req.user.id
    )
    res.status(200).json(
      {
        success: true,
        cvs,

      }
    )
  }
  catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export const deleteCVController = async (req: any, res: Response) => {

  try {
    const result = await deleteCVService(
      req.user.id,
      req.params.id
    )
    res.status(200).json(
      {
        success: true,
        ...result,
      }
    )

  }
  catch (error: any) {
    res.status(500).json(
      {
        success: false,
        message: error.message,
      }
    )



  }


}