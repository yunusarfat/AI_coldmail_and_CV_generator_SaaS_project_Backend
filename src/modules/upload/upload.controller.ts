// import { Request, Response } from "express";
// import fs from "fs/promises";
// import pdf from "pdf-parse";

// export const uploadPDF = async (req: Request, res: Response) => {
//   try {
//     const files = req.files as Express.Multer.File[];
//     const jobId = req.params.jobId;

//     if (!files || files.length === 0) {
//       return res.status(400).json({
//         message: "No PDF files uploaded",
//       });
//     }

//     const extractedTexts: string[] = [];

//     for (const file of files) {
//       const buffer = await fs.readFile(file.path);
//       const data = await pdf(buffer);
//       extractedTexts.push(data.text);
//       await fs.unlink(file.path);
//     }

//     return res.status(200).json({
//       success: true,
//       jobId,
//       profiles: extractedTexts,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Failed to process PDF files",
//     });
//   }
// };



import { Request, Response } from "express";
import fs from "fs/promises";
import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";
import pdf from "pdf-parse";

import { extractProfileFromText } from "../../utils/gemini";
import { Profile } from "../profile/profile.model";

type ProfileDocument = HydratedDocument<
  InferSchemaType<typeof Profile.schema>
>;

export const uploadPDF = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const jobId = req.params.jobId as string;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No PDF files uploaded",
      });
    }

    const createdProfiles: ProfileDocument[] = [];

    for (const file of files) {
      // Read PDF
      const buffer = await fs.readFile(file.path);

      // Extract text
      const data = await pdf(buffer);

      // AI parse
      const structured = await extractProfileFromText(data.text);

      // Save profile in DB
      const profile = await Profile.create({
        jobId,

        name: structured.name || "",
        email: structured.email || "",
        location: structured.location || "",

        currentRole: structured.currentRole || "",
        company: structured.company || "",

        experienceYears:
          structured.experienceYears || 0,

        skills: structured.skills || [],
        achievements:
          structured.achievements || [],
        projects: structured.projects || [],

        rawText: data.text,

        structuredData: structured,
      });

      createdProfiles.push(profile);

      // Delete uploaded file
      await fs.unlink(file.path);
    }

    return res.status(200).json({
      success: true,
      count: createdProfiles.length,
      profiles: createdProfiles,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};