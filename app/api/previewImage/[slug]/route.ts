import { NextRequest, NextResponse } from "next/server";
//@ts-ignore
import youtubesearchapi from "youtube-search-api"
import { YT_REGEX } from "@/app/lib/utils";
import {z} from "zod"


export async function GET(req: NextRequest,{ params }: { params: { slug: string } })
 {
   const {slug} = params
    console.log(slug);
    const extractedId = slug;
     const res = await youtubesearchapi.GetVideoDetails(extractedId);
     console.log(res);
     const title = res?.title;
     const Thumbnails = res?.thumbnail?.thumbnails;
     Thumbnails.sort((a:{width:number},b:{width:number})=> a.width<b.width ? -1 : 1);
    //  console.log(Thumbnails[Thumbnails.length - 1]);
     return NextResponse.json({title:title,bigImg: Thumbnails[Thumbnails.length - 1],smallImg: Thumbnails[Thumbnails.length-2]},{status: 200})
}