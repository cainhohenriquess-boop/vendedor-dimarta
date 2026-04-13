import { MAX_UPLOAD_SIZE_MB } from "@/lib/constants";

export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

export function isBlobUploadConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}
