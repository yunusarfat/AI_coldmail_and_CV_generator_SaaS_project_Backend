import { Profile } from "./profile.model";
import { extractProfileFromText } from "../../utils/gemini";
import { dJob } from "../djob/job.model";

export const createProfilesFromJobService = async (
  jobId: string,
  rawTexts: string[]
) => {
  const job = await dJob.findById(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  const createdProfiles = [];

  for (const text of rawTexts) {
    try {
      // STEP 1: AI extraction
      const structured = await extractProfileFromText(text);

      // STEP 2: Save profile
      const profile = await Profile.create({
        jobId,
        rawText: text,
        structuredData: structured,

        // optional flattening (for easy query)
        name: structured.name,
        email: structured.email,
        location: structured.location,
        currentRole: structured.currentRole,
        company: structured.company,
        experienceYears: structured.experienceYears,
        skills: structured.skills,
        projects: structured.projects,
        achievements: structured.achievements,
      });

      createdProfiles.push(profile);
    } catch (err) {
      console.log("Profile creation failed:", err);
    }
  }

  return createdProfiles;
};