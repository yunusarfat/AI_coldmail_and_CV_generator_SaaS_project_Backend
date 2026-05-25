import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    name: String,
    email: String,
    location: String,
    currentRole: String,
    company: String,
    experienceYears: Number,

    skills: [String],
    achievements: [String],
    projects: [
      {
        title: String,
        description: String,
        github: String,
        liveLink: String,
      },
    ],

    rawText: {
      type: String,
      required: true,
    },
    matchScore: {
      type: Number,
      default: 0,
    },

    hooks: {
      type: [String],
      default: [],
    },

    structuredData: {
      type: Object, // Gemini output stored as-is
      required: true,
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);