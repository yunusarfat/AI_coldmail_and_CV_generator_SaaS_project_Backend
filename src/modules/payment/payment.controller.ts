import { Request, Response } from "express";

import { createCheckoutSession } from "./payment.service";

export const checkoutController = async (
  req: any,
  res: Response
) => {
  try {
    const userId = req.user.id;

    const checkoutUrl = await createCheckoutSession(
      userId
    );

    res.status(200).json({
      success: true,
      url: checkoutUrl,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Payment failed",
    });
  }
};