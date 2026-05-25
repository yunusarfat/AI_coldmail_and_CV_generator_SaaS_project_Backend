import express from "express";
import { createProfilesFromJob, runProfileMatching } from "./profile.controller";

const router = express.Router();

router.post("/create-from-job", createProfilesFromJob);
router.post("/:id/match", runProfileMatching);

export default router;