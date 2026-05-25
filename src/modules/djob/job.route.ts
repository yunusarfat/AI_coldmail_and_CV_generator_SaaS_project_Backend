import express from "express";

import {
  createJobController,
  getAllJobsController,
  getSingleJobController,
} from "./job.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createJobController
);

router.get(
  "/",
  authMiddleware,
  getAllJobsController
);

router.get(
  "/:id",
  authMiddleware,
  getSingleJobController
);

export default router;