import { config } from "dotenv";

config();

export const CONFIG = {
  DB_URI: process.env.DB_URI!,
  PORT: process.env.PORT ?? 3001,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  AWS_ENDPOINT: process.env.AWS_ENDPOINT!,
  GEN_AI_GOOGLE_API_KEY: process.env.GEN_AI_GOOGLE_API_KEY!,
  ENV: process.env.ENV!,
};
