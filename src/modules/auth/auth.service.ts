import bcrypt from "bcrypt";
import { User } from "../../models/user.model";
import { generateOTP } from "../../utils/generateOTP";
import { redis } from "../../config/redis";
import { transporter } from "../../config/mail";

export const signupService = async (email: string, password: string) => {
  const existingUser = await User.findOne({ email });

  // 🔴 CASE 1: User exists
  if (existingUser) {
    if (existingUser.isVerified) {
      throw new Error("User already exists");
    }

    // resend OTP for unverified user
    const otp = generateOTP();

    await redis.set(`verify:${email}`, otp, "EX", 180);

    // async email (non-blocking but safe)
    void transporter.sendMail({
      to: email,
      subject: "Verify Email",
      text: `Your verification code is: ${otp}`,
    }).catch((err) => {
      console.error("OTP resend email failed:", err);
    });

    return {
      message: "OTP resent. Please verify your email.",
    };
  }

  // 🟢 CASE 2: New user
  const hashedPassword = await bcrypt.hash(password, 8);

  const user = await User.create({
    email,
    password: hashedPassword,
    isVerified: false,
  });

  const otp = generateOTP();

  await redis.set(`verify:${email}`, otp, "EX", 180);

  // async email (non-blocking but safe)
  void transporter.sendMail({
    to: email,
    subject: "Verify Email",
    text: `Your verification code is: ${otp}`,
  }).catch((err) => {
    console.error("Signup email failed:", err);
  });

  return {
    message: "Signup successful. Verify your email.",
    userId: user._id, // optional (useful for frontend)
  };
};


//   const existingUser = await User.findOne({ email });

//   if (existingUser) {
//     if (existingUser.isVerified) {
//       throw new Error("User already exists");
//     }

//     const otp = generateOTP();

//     // ✅ Run both concurrently, await both — no dropped emails
//     await Promise.all([
//       redis.set(`verify:${email}`, otp, "EX", 180),
//       transporter.sendMail({
//         to: email,
//         subject: "Verify Email",
//         text: `Your code: ${otp}`,
//       }),
//     ]);

//     return { message: "OTP resent. Please verify your email." };
//   }

//   const hashed = await bcrypt.hash(password, 8);

//   await User.create({ email, password: hashed });

//   const otp = generateOTP();

//   // ✅ Run both concurrently, await both — guaranteed delivery
//   await Promise.all([
//     redis.set(`verify:${email}`, otp, "EX", 180),
//     transporter.sendMail({
//       to: email,
//       subject: "Verify Email",
//       text: `Your code: ${otp}`,
//     }),
//   ]);

//   return { message: "Signup successful. Verify your email." };
// };







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




export const resendOtpService = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("User already verified");
  }

  // 🔥 CHECK COOLDOWN
  const cooldown = await redis.get(`otp:cooldown:${email}`);

  if (cooldown) {
    throw new Error("Please wait before requesting another OTP");
  }

  // generate OTP
  const otp = generateOTP();

  // store OTP (3 min expiry)
  await redis.set(`verify:${email}`, otp, "EX", 180);

  // set cooldown (60 sec)
  await redis.set(`otp:cooldown:${email}`, "1", "EX", 60);

  // send email (non-blocking)
  void transporter.sendMail({
    to: email,
    subject: "Resend OTP",
    text: `Your verification code: ${otp}`,
  }).catch((err) => {
    console.error("Resend OTP email failed:", err);
  });

  return {
    message: "OTP sent successfully",
  };
};