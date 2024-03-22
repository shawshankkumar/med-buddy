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
    .findOne({ fileName });
  if (!data) {
    return res.status(404).json({ message: "File not found" });
  }

  if (!force && data.summary) {
    const { dump, ...resData } = data;
    return res.status(200).json(resData);
  }
  const url = `https://cf.shawshankkumar.me/file%2F${data.userId}%2F${fileName}`;
  // @ts-ignore
  const pdfDownload = await axios.get(url, { responseType: "arraybuffer" });
  const pdfData = await PdfParse(pdfDownload.data);
  // @ts-ignore
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt =
    "Imagine you're a doctor tasked with summarizing a medical report for a patient. After reviewing the test parameters, provide a concise summary of the findings and their implications without delving into technical jargon. Describe any abnormalities detected in a clear and reassuring manner. Your summary should be no more than 1000 words and should aim to educate the patient about their health without causing undue alarm. Finally, provide a succinct summary of the entire report in the next line in 500 words or less. \n" +
    pdfData.text;

  const prompt_2 =
    "Imagine you're a nutritionist tasked with providing tailored dietary recommendations to improve the results of the medical report provided. After reviewing the text, offer specific guidance on foods to include and avoid based on the patient's condition. Be sure to provide recommendations for strictly non-vegetarian, outlining foods that can support optimal health and those that should be limited or avoided. Your advice should be clear, concise, and directly related to the information provided in the report.\n " +
    pdfData.text;

  const prompt_3 =
    "Pretend you are a doctor and based on the report in next line, suggest to this patient if they need to visit another doctor or get any tests done, if there is even a slight abnormality in report, please ask them to do so.\n" +
    pdfData.text;

  const prompt_4 =
    "Imagine you're a nutritionist tasked with providing tailored dietary recommendations to improve the results of the medical report provided. After reviewing the text, offer specific guidance on foods to include and avoid based on the patient's condition. Be sure to provide separate recommendations for strictly vegetarian indian diet, outlining foods that can support optimal health and those that should be limited or avoided. Your advice should be clear, concise, and directly related to the information provided in the report.\n " +
    pdfData.text;

  const resultAll = await Promise.all([
    model.generateContent(prompt),
    model.generateContent(prompt_2),
    model.generateContent(prompt_3),
    model.generateContent(prompt_4),
  ]);

  console.log(resultAll);
  const finalData = {
    summary: resultAll[0].response.text(),
    food_non_veg: resultAll[1].response.text(),
    advice: resultAll[2].response.text(),
    food_veg: resultAll[3].response.text(),
  };
  await (await getDb()).collection("files").updateOne(
    { fileName },
    {
      $set: { ...finalData, dump: JSON.stringify(resultAll) },
    }
  );
  res.status(200).json({
    data: finalData,
  });
}

export async function getChatService(req: Request, res: Response) {
  const token = req.headers.authorization;
  const fileName = req.body.fileName;
  const tokenObj = await (await getDb())
    .collection("tokens")
    .findOne({ token });
  if (!tokenObj) {
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }
  if (!req.body.message) {
    return res.status(404).json({ message: "message not found" });
  }

  const userId = tokenObj.userId;
  const data = await (await getDb()).collection("files").findOne({ fileName });
  if (!data) {
    return res.status(404).json({ message: "File not found" });
  }

  const url = `https://cf.shawshankkumar.me/file%2F${userId}%2F${fileName}`;
  // @ts-ignore
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  console.log(data.chat);
  const chat = model.startChat({
    history: data.chat,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  const result = await chat.sendMessage(
    req.body.message + "\n" + " reply to this in" + req.body.lang
  );

  const response = await result.response;
  const text = response.text();
  console.log(text);
  await (await getDb()).collection("files").updateOne(
    { fileName },
    {
      $push: {
        chat: {
          $each: [
            {
              role: "user",
              parts: [
                {
                  text: req.body.message,
                },
              ],
              timestamp: +new Date(),
            },
            {
              role: "model",
              parts: [
                {
                  text: text,
                },
              ],
              timestamp: +new Date() + 1,
            },
          ],
        },
      },
    }
  );

  const newData = data.chat.concat([
    {
      role: "user",
      parts: [
        {
          text: req.body.message,
        },
      ],
      timestamp: +new Date(),
    },
    {
      role: "model",
      parts: [
        {
          text: text,
        },
      ],
      timestamp: +new Date() + 1,
    },
  ]);
  res.status(200).json({
    data: newData.sort((a: any, b: any) => a.timestamp - b.timestamp),
  });
}
