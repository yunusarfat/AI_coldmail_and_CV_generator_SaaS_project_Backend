import mongoose from "mongoose";

const jobAnalysisSchema = new mongoose.Schema({
  role: {
    type: String,
    default: "",
  },

  skills: {
    type: [String],
    default: [],
  },

  keywords: {
    type: [String],
    default: [],
  },

  tone: {
    type: String,
    default: "",
  },

  seniority: {
    type: String,
    default: "",
  },
});

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "New Campaign",
    },

    desiredPost: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "ready", "failed"],
      default: "pending",
    },

    jobAnalysis: {
      type: jobAnalysisSchema,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const dJob = mongoose.model("dJob", jobSchema);