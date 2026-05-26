import { OAuth2Client } from "google-auth-library";
import { User } from "../../models/user.model";
import { generateToken } from "../../utils/jwt";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// STEP 1: verify Google token
export const verifyGoogleToken = async (idToken: string) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new Error("Invalid Google token");
  }

  return {
    email: payload.email,
    name: payload.name,
    googleId: payload.sub,
  };
};