import { Request, Response } from "express";
import { getDb } from "../lib/db";
import { deleteFile } from "../lib/utils";
import path from "path";
import fs from "fs";
import { s3 } from "../lib/storage";
import PdfParse from "pdf-parse";

export async function uploadService(req: Request, res: Response) {
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
}

export async function filesService(req: Request, res: Response) {
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
}
