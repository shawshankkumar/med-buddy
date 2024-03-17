import { Request, Response } from "express";
import { getDb } from "../lib/db";
import PdfParse from "pdf-parse";
import { genAI } from "../lib/utils";
import axios from "axios";

export async function summaryService(req: Request, res: Response) {
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

  const prompt =
    `Pretend that you are a doctor, give report summary after reading the test parameters and tell without much technical details about what happened, their values and if it's abnormal. Give diet and nutrition advice to improve the results of the report. Tell us about the medical condition from the report results. Each section should have a key in an object 'Report Summary:', 'Diet and nutrition advice:', 'Medical Condition:' Write report summary in less than 1000 words in a way that normal person can get some idea. In the diet plan, tell what should the patient avoid and eat based on the report since giving a complete diet plan would need more test results. Write the medical condition in less than 1000 words in a way that a normal person would understand about health and don't get scared. In the medical condition part, tell which type of doctor and practioner should this patient go to. Be very specific about diet and also recommend foods they can eat and should avoid\n` +
    pdfData.text;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  await (await getDb())
    .collection("files")
    .updateOne({ userId, fileName }, { $set: { summary: text } });
  res.status(200).json({
    data: text,
  });
}
