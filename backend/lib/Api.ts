import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

export default async function generateReadmeWithGemini(
  apiKey: string,
  tsFiles: { filePath: string; content: string }[]
) {
  let codeContext = "";
  for (const file of tsFiles) {
    codeContext += `\n// File: ${file.filePath}\n${file.content}\n`;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = `You're an expert AI that writes clear, professional README.md in markdown format for Github.

Based on the following codebase, generate a detailed README.md that includes:
- Project description
- Installation steps
- Create dummy jsons for each route and there responses
- Run Locally steps

Also do clean formatting so that it can be written on Github Readme.md code and preview is beautiful.
Write it in that format that i can just copy paste it in my readme.md file.
Here is the codebase:
${codeContext}`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
