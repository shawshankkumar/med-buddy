import express from "express";
import path from "path";
import fs from "fs";
import { ulid } from "ulid";
import PdfParse from "pdf-parse";
import axios from "axios";
import bcrypt from "bcrypt";
import cors from "cors";
import { getDb } from "./src/lib/db";
import { deleteFile } from "./src/lib/utils";
import { s3, upload } from "./src/lib/storage";
import helmet from "helmet";
import { CONFIG } from "./src/lib/config";
import { logger } from "./src/lib/logger";
import { healthcheckService } from "./src/api/healthcheck";
import { loginService, signupService } from "./src/api/auth";

const port = process.env.PORT ?? 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(helmet());

app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "Please upload a PDF file." });
  }
  const filePath = path.join(__dirname, "uploads", file.filename);

  const token = req.headers.authorization;
  const tokenObj = await (await getDb())
    .collection("tokens")
    .findOne({ token });
  if (!tokenObj) {
    deleteFile(filePath, file.filename);
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }
  const userId = tokenObj.userId;

  const fileContent = fs.readFileSync(file.path);

  const params = {
    Bucket: "shashank",
    Key: `file/${userId}/${file.filename}`,
    Body: fileContent,
    ContentType: "application/pdf",
    ACL: "public-read",
  };

  const pdfData = await PdfParse(fileContent);
  // @ts-ignore
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt_2 =
    "is the next line of the string resembling a medical test report? if yes return true otherwise false, nothing else \n" +
    pdfData.text;
  const result_2 = await model.generateContent(prompt_2);
  const response_2 = await result_2.response;
  const text_2 = response_2.text();
  console.log(text_2, pdfData.text);
  // @ts-ignore
  if (text_2 === "false") {
    deleteFile(filePath, file.filename);
    return res.send({
      response: "Error",
      message: "Not a medical report",
    });
  }

  s3.upload(params, async function (err, data) {
    if (err) {
      deleteFile(filePath, file.filename);
      throw err;
    }
    res.send({
      response: "Success",
      message: "File uploaded successfully",
      url: `https://cf.shawshankkumar.me/file%2F${userId}%2F${file.filename}`,
      name: file.filename,
      text_2,
    });
  });

  await (await getDb()).collection("files").insertOne({
    createdAt: +new Date(),
    userId,
    fileName: file.filename,
    reportName: req.body.name,
  });

  deleteFile(filePath, file.filename);
});

app.get("/files", async (req, res) => {
  const token = req.headers.authorization;
  const tokenObj = await (await getDb())
    .collection("tokens")
    .findOne({ token });
  if (!tokenObj) {
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }
  const userId = tokenObj.userId;
  const data = await (await getDb())
    .collection("files")
    .find({ userId })
    .toArray();
  const updatedData = data.map((e) => {
    const { _id, ...eNew } = e;
    return {
      ...eNew,
      fileUrl: `https://cf.shawshankkumar.me/file%2F${e.userId}%2F${e.fileName}`,
    };
  });
  res.status(200).json({
    data: updatedData,
  });
});

app.post("/summary", async (req, res) => {
  const token = req.headers.authorization;
  const fileName = req.body.fileName;
  const force = req.body.force;
  const tokenObj = await (await getDb())
    .collection("tokens")
    .findOne({ token });
  if (!tokenObj) {
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }
  const userId = tokenObj.userId;
  const data = await (await getDb())
    .collection("files")
    .findOne({ userId, fileName });
  if (!data) {
    return res.status(404).json({ message: "File not found" });
  }

  if (!force && data.summary) {
    return res.status(200).json({
      data: data.summary,
    });
  }
  const url = `https://cf.shawshankkumar.me/file%2F${userId}%2F${fileName}`;
  // @ts-ignore
  const pdfDownload = await axios.get(url, { responseType: "arraybuffer" });
  const pdfData = await PdfParse(pdfDownload.data);
  // @ts-ignore
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt_2 =
    `Pretend that you are a doctor, give report summary after reading the test parameters and tell without much technical details about what happened, their values and if it's abnormal. Give diet and nutrition advice to improve the results of the report. Tell us about the medical condition from the report results. Each section should have a key in an object 'Report Summary:', 'Diet and nutrition advice:', 'Medical Condition:' Write report summary in less than 1000 words in a way that normal person can get some idea. In the diet plan, tell what should the patient avoid and eat based on the report since giving a complete diet plan would need more test results. Write the medical condition in less than 1000 words in a way that a normal person would understand about health and don't get scared. In the medical condition part, tell which type of doctor and practioner should this patient go to. Be very specific about diet and also recommend foods they can eat and should avoid\n` +
    pdfData.text;
  const result_2 = await model.generateContent(prompt_2);
  const response_2 = await result_2.response;
  const text_2 = response_2.text();
  console.log(text_2);
  await (await getDb())
    .collection("files")
    .updateOne({ userId, fileName }, { $set: { summary: text_2 } });
  res.status(200).json({
    data: text_2,
  });
});

app.post("/register", signupService);

app.post("/login", loginService);

app.get("/", healthcheckService);

app.listen(port, () => {
  logger.info(`MED BUDDY app listening on port ${port}`);
});
