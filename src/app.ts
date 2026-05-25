import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.route";
import { authMiddleware } from "./middleware/auth.middleware";
// import jobRoutes from "./modules/job/job.route";
import uploadRoutes from "./modules/upload/upload.route";
import profileRoutes from "./modules/profile/profile.route";
import djobRoutes from "./modules/djob/job.route";
import emailRoutes from "./modules/email/email.route";

import cvRoutes from "./modules/cv/cv.routes";


import paymentRoutes from "./modules/payment/payment.route";




const app = express();
app.use(
  "/api/payment/webhook",
  express.raw({  type: "*/*" })
);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/payment", paymentRoutes);


app.use("/api/auth",authRoutes);
// app.use("/api/jobs",jobRoutes);
app.get("/api/test", authMiddleware, (req, res) => {
    res.json({
      message: "Protected route working",
      user: (req as any).user,
    });
  });


app.use("/api/upload", uploadRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/djob", djobRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/cv", cvRoutes);
app.use(
  "/generated-cvs",
  express.static("generated-cvs")
);
// app.use("/api/payment", paymentRoutes);

export default app;