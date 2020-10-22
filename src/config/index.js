import { config } from "dotenv";

const { parsed } = config();

export const {
  DB,
  PORT,
  MODE,
  SECRET,
  BASE_URL,
  URL = `${BASE_URL}`,
  IN_PROD = MODE !== "prod",
} = parsed;
