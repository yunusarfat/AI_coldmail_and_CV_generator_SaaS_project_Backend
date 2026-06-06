import { Request, Response } from "express";
import { signupService } from "./auth.service";
import { verifyEmailService } from "./auth.service";
import { signinService } from "./auth.service";
import { sendResetCodeService } from "./auth.service";
import { resetPasswordService } from "./auth.service";
import { resendOtpService } from "./auth.service";

export const signup = async (req: Request, res: Response) => {
    try {
        const user = await signupService(
            req.body.email,
            req.body.password
        );
        res.json({
            message: "User created successfully",
        })
    }
    catch (err: any) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }

}


export const verifyEmail = async (req: Request, res: Response) => {
    try {
      const { email, code } = req.body;
  
      await verifyEmailService(email, code);
  
      res.json({ message: "Email verified successfully" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };


 



  export const signin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      const { token } = await signinService(email, password);
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
  
      res.json({ message: "Login successful" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };



  export const sendResetCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
  
      await sendResetCodeService(email);
  
      res.json({ message: "Reset code sent" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };



  export const resetPassword = async (req: Request, res: Response) => {
    try {
      const { email, code, newPassword } = req.body;
  
      await resetPasswordService(email, code, newPassword);
  
      res.json({ message: "Password updated successfully" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };



  export const resendOtp = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
  
      const result = await resendOtpService(email);
  
      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        error: error.message,
      });
    }
  };






export const logout = (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: false, // true in production
    sameSite: "lax",
    expires: new Date(0), // 👈 instantly expire cookie
  });

  return res.json({ message: "Logged out successfully" });
};






import { verifyGoogleToken } from "./auth.google";
import { User } from "../../models/user.model";
import { generateToken } from "../../utils/jwt";

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    const googleUser = await verifyGoogleToken(idToken);

    // check user
    let user = await User.findOne({ email: googleUser.email });

    // create if not exists
    if (!user) {
      user = await User.create({
        email: googleUser.email,
        password: "", // no password for google users
        isVerified: true,
      });
    }

    // generate JWT
    const token = generateToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
    });

    res.json({
      message: "Google login successful",
      user,
      token,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message,
    });
  }
};






