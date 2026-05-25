import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dJob",
      required: true,
    },

    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    tone: {
      type: String,
      default: "professional",
    },

    status: {
      type: String,
      enum: ["draft", "sent"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export const Email = mongoose.model("Email", emailSchema);