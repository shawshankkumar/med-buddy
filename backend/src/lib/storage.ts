import multer from "multer";
import AWS from "aws-sdk";
import { ulid } from "ulid";
import path from "path";
import { CONFIG } from "./config";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: Function) => {
    cb(null, "uploads/");
  },
  filename: (req: Request, file: any, cb: Function) => {
    cb(null, "file_" + ulid() + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req: Request, file: any, cb: Function) => {
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
