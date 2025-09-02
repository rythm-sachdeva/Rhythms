import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from "googleapis";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateYoutubeLinks(text:string)
{
   const llmPrompt = `
  Based on the request "${text}", generate a JSON array of 10 relevant music videos from YouTube.
  Each object in the array must strictly conform to the following structure and data types:
  
  {        
    "title": "string",          // The full title of the video
  }

  Only return the raw JSON array. Do not include any markdown formatting like \`\`\`json, explanations, or introductory text. Ensure all data is accurate and corresponds to real YouTube videos.
`;
    const result = await  model.generateContent(llmPrompt);
    //@ts-ignore
    const response =  result.response.text();
    const newSongs = await JSON.parse(response.replace(/```json/g, "").replace(/```/g, ""));
    return newSongs;

}