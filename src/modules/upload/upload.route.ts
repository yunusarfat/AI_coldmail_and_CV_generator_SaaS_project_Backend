import express from "express";
import multer from "multer";

import { uploadPDF } from "./upload.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }

    cb(null, true);
  },
});

router.post(
  "/:jobId",
  authMiddleware,
  upload.array("files", 10),
  uploadPDF
);

export default router;