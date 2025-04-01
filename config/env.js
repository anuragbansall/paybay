import { config } from "dotenv";

config({ path: `.env.${process.NODE_ENV || "development"}.local` });

export const { PORT, NODE_ENV } = process.env;
