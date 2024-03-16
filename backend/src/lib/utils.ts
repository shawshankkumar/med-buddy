import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CONFIG } from "./config";

export function deleteFile(filePath, filename) {
  if (fs.existsSync(filePath)) {
    // Delete the file
    fs.unlinkSync(filePath);
    console.log(`${filename} has been deleted successfully.`);
  } else {
    console.log(`File ${filename} does not exist.`);
  }
}

export const genAI = new GoogleGenerativeAI(CONFIG.GEN_AI_GOOGLE_API_KEY);
