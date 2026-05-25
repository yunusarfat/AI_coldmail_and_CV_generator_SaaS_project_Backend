import { Request, Response } from "express";

import {
  generateEmailService,
  getAllEmailsService,
  getSingleEmailService,
} from "./email.service";





export const generateEmailController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const { profileId, tone } = req.body;

    const email = await generateEmailService(
      userId,
      profileId,
      tone
    );

    res.status(201).json({
      success: true,
      email,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





export const getAllEmailsController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const emails = await getAllEmailsService(userId);

    res.json({
      success: true,
      emails,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





export const getSingleEmailController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const email = await getSingleEmailService(
      userId,
      req.params.id as string
    );

    res.json({
      success: true,
      email,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



import { deleteEmailService } from "./email.service";

export const deleteEmailController = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deletedEmail = await deleteEmailService(userId, id);

    res.json({
      success: true,
      message: "Email deleted successfully",
      email: deletedEmail,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

