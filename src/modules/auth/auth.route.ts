import { Router } from "express";
import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { signup } from "./auth.controller";
import { verifyEmail } from "./auth.controller";
import { signin } from "./auth.controller";
import { sendResetCode } from "./auth.controller";
import { resetPassword } from "./auth.controller";
import { logout } from "./auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/signin", signin);
router.post("/forgot-password", sendResetCode);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);


router.get("/me", authMiddleware, (req, res) => {
    res.json(
        {
            user: (req as any).user,
        }
    )
})





export default router;

