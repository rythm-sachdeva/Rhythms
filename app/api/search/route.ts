//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const searchSchema= z.object({
    query: z.string()
})


export async function POST(req: NextRequest,res: NextResponse) {
    const data = searchSchema.safeParse(await req.json());
     const results = await youtubesearchapi.GetListByKeyword(data.data?.query, false, 10);
    console.log(results)
    return NextResponse.json(results)
}