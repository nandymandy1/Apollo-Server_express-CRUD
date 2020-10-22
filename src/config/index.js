import { config } from "dotenv";

const { parsed } = config();

export const {
  DB,
  MODE,
  SECRET,
  BASE_URL,
  IN_PROD = MODE !== "prod",
  URL = `${BASE_URL}`,
  PORT = MODE !== "prod" ? PORT : process.env.PORT,
} = parsed;
