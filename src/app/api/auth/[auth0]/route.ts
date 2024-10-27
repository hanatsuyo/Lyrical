import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import jwt from "jsonwebtoken";

export const GET = handleAuth();

const afterCallback = async (req: any, res: any, session: any) => {
  const payload = {
    userId: session.user.sub,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  session.user.accessToken = jwt.sign(payload, process.env.SUPABASE_JWT_SECRET);

  return session;
};

export default handleAuth({
  async callback(req: any, res: any) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (error: any) {
      res.status(error.status || 500).end(error.message);
    }
  },
});
