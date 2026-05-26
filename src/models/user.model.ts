import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false},
        isVerified: { type: Boolean, default: false },
        credits: { type: Number, default: 10 },
        plan: {
            type: String,
            enum: ["free", "pro"],
            default: "free",
          },
          
          planExpiresAt: {
            type: Date,
            default: null,
          },
    },

    { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
