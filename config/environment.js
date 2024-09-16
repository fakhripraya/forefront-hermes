import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Konversi URL file saat ini menjadi path file
const __filename = fileURLToPath(import.meta.url);
// Dapatkan direktori dari path file tersebut
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

export const APP_PORT = process.env.PORT || 7001;
export const APP_STATE = process.env.APP_STATE || "DEV";
export const APP_WITH_PREFIX =
  process.env.APP_WITH_PREFIX === "true" ||
  process.env.APP_WITH_PREFIX === "1";

export const APP_ORIGIN =
  process.env.APP_ORIGIN || "http://localhost:3000";
export const APP_CERT_PATH =
  process.env.APP_CERT_PATH || "";
export const APP_KEY_PATH = process.env.APP_KEY_PATH || "";
export const APP_ENABLE_LOCAL_HTTPS =
  process.env.APP_ENABLE_LOCAL_HTTPS === "true" ||
  process.env.APP_ENABLE_LOCAL_HTTPS === "1";

export const APP_OLYMPUS_SERVICE_BASE_URL =
  process.env.APP_OLYMPUS_SERVICE_BASE_URL || "";

export const APP_CLIENT_BASE_URL =
  process.env.APP_CLIENT_BASE_URL || "";

export const APP_GRPC_MESSAGING_SERVICE_HOST =
  process.env.APP_GRPC_MESSAGING_SERVICE_HOST || "";
export const APP_GRPC_MESSAGING_SERVICE_PORT =
  process.env.APP_GRPC_MESSAGING_SERVICE_PORT || "";
