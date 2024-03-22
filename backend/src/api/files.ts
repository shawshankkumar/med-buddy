import { Request, Response } from "express";
import { getDb } from "../lib/db";
import { deleteFile } from "../lib/utils";
import fs from "fs";
import { s3 } from "../lib/storage";
import PdfParse from "pdf-parse";
import { genAI } from "../lib/utils";

export async function uploadService(req: Request, res: Response) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "Please upload a PDF file." });
  }

  const token = req.headers.authorization;
  const tokenObj = await (await getDb())
    .collection("tokens")
    .findOne({ token });
  if (!tokenObj) {
    deleteFile(file.filename);
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

  const prompt =
    "is the next line of the string resembling a medical test report? if yes return true otherwise false, nothing else \n" +
    pdfData.text;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text, pdfData.text);
  // @ts-ignore
  if (text === "false") {
    deleteFile(file.filename);
    return res.send({
      response: "Error",
      message: "Not a medical report",
    });
  }

  s3.upload(params, async function (err: any, data: any) {
    if (err) {
      deleteFile(file.filename);
      throw err;
    }
    res.send({
      response: "Success",
      message: "File uploaded successfully",
      url: `https://cf.shawshankkumar.me/file%2F${userId}%2F${file.filename}`,
      name: file.filename,
      text,
    });
  });
  const prompt_2 =
    "is the next line of the string resembling a medical test report, suggest a 5-10 word name for this report, use patient name, type of report and paramters \n" +
    pdfData.text;
  const result_2 = await model.generateContent(prompt_2);
  const response_2 = await result_2.response;
  const text_2 = response_2.text();
  await (await getDb()).collection("files").insertOne({
    createdAt: +new Date(),
    userId,
    fileName: file.filename,
    reportName: text_2,
    sharedWith: [],
    chat: [
      {
        role: "user",
        parts: [
          {
            text:
              "Hello, I want you to pretend that you are a doctor and a nutritionist. Based on the report data in next line, please reply to me as if you are a doctor, be descriptive and answer with as much clarity and details as you can. each text from user is a question related to the report, take that in context. Do not refuse any questions, just politely reply.\n" +
              pdfData.text,
          },
        ],
        timestamp: +new Date(),
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. I am medical bot" }],
        timestamp: +new Date() + 1,
      },
    ],
  });

  deleteFile(file.filename);
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
      shared: false
    };
  });
  const emailData = await (await getDb())
    .collection("users")
    .findOne({ userId });
  
  const dataShared = await (
    await getDb()
  )
    .collection("files")
    .find({ sharedWith: [emailData!.email] })
    .toArray();

  const updatedDataShared = dataShared.map((e) => {
    const { _id, ...eNew } = e;
    return {
      ...eNew,
      fileUrl: `https://cf.shawshankkumar.me/file%2F${e.userId}%2F${e.fileName}`,
      shared: true
    };
  });

  res.status(200).json({
    data: updatedData.concat(updatedDataShared),
  });
}

export async function shareService(req: Request, res: Response) {
  const token = req.headers.authorization;
  const tokenObj = await (await getDb())
    .collection("tokens")
    .findOne({ token });
  if (!tokenObj) {
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }
  if (!req.body.fileName) {
    return res.status(422).json({ message: "File name mandatory" });
  }
  if (!req.body.email) {
    return res.status(422).json({ message: "Email name mandatory" });
  }
  const userId = tokenObj.userId;
  await (await getDb())
    .collection("files")
    .updateOne(
      { userId, fileName: req.body.fileName },
      { $push: { sharedWith: req.body.email } }
    );
  res.status(200).json({
    success: true,
  });
}

export async function sharedFilesService(req: Request, res: Response) {
  const token = req.headers.authorization;
  const tokenObj = await (await getDb())
    .collection("tokens")
    .findOne({ token });
  if (!tokenObj) {
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }
  const userId = tokenObj.userId;
  const emailData = await (await getDb())
    .collection("users")
    .findOne({ userId });
  const data = await (
    await getDb()
  )
    .collection("files")
    .find({ sharedWith: [emailData?.email] })
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

export async function getChatAllService(req: Request, res: Response) {
  const token = req.headers.authorization;
  console.log("uauau")
  const tokenObj = await (await getDb())
    .collection("tokens")
    .findOne({ token });
    console.log(tokenObj)
  if (!tokenObj) {
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }
  const data = await (await getDb())
    .collection("files")
    .findOne({ fileName: req.body.fileName });
  if (!data) {
    res.status(404).json({ message: "File not found" });
  }
  console.log(data)
  res.status(200).json({
    data: data!.chat,
    fileData: data
  });
}
