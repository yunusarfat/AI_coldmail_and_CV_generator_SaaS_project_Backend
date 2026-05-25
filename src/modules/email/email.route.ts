import express from "express";
import { checkCredits } from "../../middleware/credit.middleware";

import {
  generateEmailController,
  getAllEmailsController,
  getSingleEmailController,
  deleteEmailController,
} from "./email.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.post(
  "/generate",
  authMiddleware,
  checkCredits(1),
  generateEmailController
);

router.get(
  "/",
  authMiddleware,
  getAllEmailsController
);

router.get(
  "/:id",
  authMiddleware,
  getSingleEmailController
);

router.delete(
    "/:id",
    authMiddleware,
    deleteEmailController
  );

export default router;