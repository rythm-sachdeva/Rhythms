import { NextRequest } from "next/server";
import { generateYoutubeLinks } from "@/lib/LLMService/GeminiP";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";

export async function POST(request:NextRequest) {
    const {text} = await request.json();
    try {
        console.log("Received text:", text); // Debug log to check the received text
        const youtubeLink  = await generateYoutubeLinks(text);

        console.log("Generated Youtube Links:",youtubeLink)
          const updatedyoutubeLink = youtubeLink.map(async (item:any)=>{
            const searchResults = await youtubesearchapi.GetListByKeyword(item.title.slice(0,item.title.indexOf('|')).trim(), false, 1);
            return searchResults.items[0];
          })
          return Response.json(await Promise.all(updatedyoutubeLink), { status: 200})
    } catch (error) {
        console.error("Error generating YouTube links:", error);
        return Response.json("Error generating YouTube links", { status: 500 });
    }

    
}