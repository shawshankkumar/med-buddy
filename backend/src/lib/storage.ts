import multer from "multer";
import AWS from "aws-sdk";
import { ulid } from "ulid";
import path from "path";
import { CONFIG } from "./config";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "file_" + ulid() + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .pdf format allowed!"));
    }
  },
});

export const s3 = new AWS.S3({
  accessKeyId: CONFIG.AWS_ACCESS_KEY_ID,
  secretAccessKey: CONFIG.AWS_SECRET_ACCESS_KEY,
  endpoint: CONFIG.AWS_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});
