import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDB } from "./config/db";


const start = async () => {
  await connectDB();
  app.listen(5000, () => console.log("Server running"));
};

start();