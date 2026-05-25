import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { generateCVController,getAllCVsController,
    deleteCVController, } from "./cv.controller";
import { checkCredits } from "../../middleware/credit.middleware";

const router = express.Router();

router.post("/generate",authMiddleware, checkCredits(2), generateCVController);
// get all cvs
router.get(
    "/",
    authMiddleware,
    getAllCVsController
  );
  
  // delete cv
  router.delete(
    "/:id",
    authMiddleware,
    deleteCVController
  );

export default router;