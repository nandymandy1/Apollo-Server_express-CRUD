import { config } from "dotenv";

const { parsed } = config();

export const {
  DB,
  MODE,
  SECRET,
  BASE_URL,
  URL = `${BASE_URL}`,
  IN_PROD = MODE !== "prod",
} = parsed;

export const PORT = parsed.PORT || process.env.PORT;
