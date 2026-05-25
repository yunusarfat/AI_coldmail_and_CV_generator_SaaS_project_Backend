import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { hasEnoughCredits } from "../utils/credit.utils";

export const checkCredits = (cost: number) => {
  return async (req: any, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!hasEnoughCredits(user, cost)) {
      return res.status(403).json({
        success: false,
        message: "Not enough credits. Upgrade to Pro.",
      });
    }

    req.userData = user;
    next();
  };
};