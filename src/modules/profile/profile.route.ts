// import express from "express";
// import { createProfilesFromJob, runProfileMatching } from "./profile.controller";

// const router = express.Router();

// router.post("/create-from-job", createProfilesFromJob);
// router.post("/:id/match", runProfileMatching);

// export default router;



import express from "express";
import { createProfilesFromJob, runProfileMatching, getProfilesByJob } from "./profile.controller";

const router = express.Router();

router.post("/create-from-job", createProfilesFromJob);
router.post("/:id/match", runProfileMatching);
router.get("/job/:jobId", getProfilesByJob);

export default router;