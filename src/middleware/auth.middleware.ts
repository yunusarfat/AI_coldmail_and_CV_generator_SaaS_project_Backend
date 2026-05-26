import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

interface JwtPayload {
  id: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    // prioritize bearer token
    const token = bearerToken || req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized - No token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    (req as any).user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};



// export const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // 🍪 get token from cookie
//     const bearerToken = req.headers.authorization?.startsWith("Bearer ")
//       ? req.headers.authorization.split(" ")[1]
//       : null;

//     const token = req.cookies.token || bearerToken;

//     if (!token) {
//       return res.status(401).json({
//         error: "Unauthorized - No token",
//       });
//     }

//     // 🔐 verify token
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET!
//     ) as JwtPayload;

//     // 👤 find user
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(401).json({
//         error: "User not found",
//       });
//     }

//     // ✅ attach user to request
//     (req as any).user = user;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       error: "Invalid token",
//     });
//   }
// };