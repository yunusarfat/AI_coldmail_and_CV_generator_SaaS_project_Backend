import bcrypt from "bcrypt";
import { User } from "../../models/user.model";
import { generateOTP } from "../../utils/generateOTP";
import { redis } from "../../config/redis";
import { transporter } from "../../config/mail";

// export const signupService = async (email: string, password: string) => {
//   const existingUser = await User.findOne({ email });

//   // 🔴 Case 1: user exists
//   if (existingUser) {
//     // ✅ already verified → block
//     if (existingUser.isVerified) {
//       throw new Error("User already exists");
//     }

//     // 🔁 not verified → resend OTP
//     const otp = generateOTP();

//     await redis.set(`verify:${email}`, otp, "EX", 180);

//     await transporter.sendMail({
//       to: email,
//       subject: "Verify Email",
//       text: `Your code: ${otp}`,
//     });

//     return { message: "OTP resent. Please verify your email." };
//   }

//   // 🟢 Case 2: new user → create
//   const hashed = await bcrypt.hash(password, 8);

//   const user = await User.create({
//     email,
//     password: hashed,
//   });

//   const otp = generateOTP();

//   await redis.set(`verify:${email}`, otp, "EX", 180);

//   await transporter.sendMail({
//     to: email,
//     subject: "Verify Email",
//     text: `Your code: ${otp}`,
//   });

//   return { message: "Signup successful. Verify your email." };
// };

export const signupService = async (email: string, password: string) => {
  const existingUser = await User.findOne({ email });

  // 🔴 Case 1: user exists
  if (existingUser) {
    if (existingUser.isVerified) {
      throw new Error("User already exists");
    }

    const otp = generateOTP();

    // Fire these concurrently since they don't depend on each other
    await redis.set(`verify:${email}`, otp, "EX", 180);

    // ⚡ OPTIMIZATION: Remove 'await' from sendMail so it runs in the background
    transporter.sendMail({
      to: email,
      subject: "Verify Email",
      text: `Your code: ${otp}`,
    }).catch(err => console.error("Failed to resend signup email:", err));

    return { message: "OTP resent. Please verify your email." };
  }

  // 🟢 Case 2: new user → create
  // Note: Your bcrypt salt rounds here is 8, which is already fast!
  const hashed = await bcrypt.hash(password, 8);

  const user = await User.create({
    email,
    password: hashed,
  });

  const otp = generateOTP();

  // Save to redis
  await redis.set(`verify:${email}`, otp, "EX", 180);

  // ⚡ OPTIMIZATION: Do not 'await' the SMTP network call!
  // Let it execute asynchronously while returning the response instantly.
  transporter.sendMail({
    to: email,
    subject: "Verify Email",
    text: `Your code: ${otp}`,
  }).catch(err => console.error("Failed to send signup email:", err));

  return { message: "Signup successful. Verify your email." };
};







export const verifyEmailService = async (email: string, code: string) => {
  const storedCode = await redis.get(`verify:${email}`);

  if (!storedCode) throw new Error("Code expired");
  if (storedCode !== code) throw new Error("Invalid code");

  await User.findOneAndUpdate({ email }, { isVerified: true });

  await redis.del(`verify:${email}`);

  return true;
};



import { generateToken } from "../../utils/jwt";

export const signinService = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");
  if (!user.isVerified) throw new Error("Email not verified");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Wrong password");

  const token = generateToken(user._id.toString());

  return { user, token };
};



//forgot pass flow start herereeeeee

//reset code

export const sendResetCodeService = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const otp = generateOTP();

  await redis.set(`reset:${email}`, otp, "EX", 180);

  await transporter.sendMail({
    to: email,
    subject: "Password Reset",
    text: `Your reset code: ${otp}`,
  });

  return true;
};


export const resetPasswordService = async (email : string, code : string, newPassword : string) => {
  const storedCode = await redis.get(`reset:${email}`);

  if (!storedCode || storedCode !== code) {
    throw new Error("Invalid or expired code");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  const user = await User.findOneAndUpdate(
    { email },
    { password: hashed },
    { new: true }
  );
  console.log("user:", user);
  console.log("password:", user?.password);

  if (!user) throw new Error("User not found");

  await redis.del(`reset:${email}`);

  return true;
};