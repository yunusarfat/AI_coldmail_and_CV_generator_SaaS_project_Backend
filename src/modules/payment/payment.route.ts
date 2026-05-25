import express from "express";

import { authMiddleware } from "../../middleware/auth.middleware";

import { checkoutController } from "./payment.controller";

import { stripeWebhookController } from "./webhook.controller";

const router = express.Router();

router.post(
  "/checkout",
  authMiddleware,
  checkoutController
);

router.post(
    "/webhook",
    stripeWebhookController
  );

export default router;