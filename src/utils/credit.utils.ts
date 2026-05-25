import { User } from "../models/user.model";

export const hasEnoughCredits = (
  user: any,
  cost: number
) => {
  // PRO USERS = unlimited
  if (user.plan === "pro" && user.planExpiresAt > new Date()) {
    return true;
  }

  return user.credits >= cost;
};

export const deductCredits = async (
  userId: string,
  cost: number
) => {
  await User.findByIdAndUpdate(userId, {
    $inc: { credits: -cost },
  });
};