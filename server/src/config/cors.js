import cors from "cors";
import { env } from "./env.js";

export const corsMiddleware = cors({
  origin: env.CLIENT_URL,
  credentials: true,
});
