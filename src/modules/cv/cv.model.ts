import mongoose from "mongoose";

const cvSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "dJob",
    },

    pdfUrl: {
      type: String,
      default: "",
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },

    tailoredData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const CV = mongoose.model("CV", cvSchema);