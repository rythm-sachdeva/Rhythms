import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "../../lib/db";
import { YT_REGEX } from "../../lib/utils";

//@ts-ignore
import youtubesearchapi from "youtube-search-api"

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

export async function POST(req: NextRequest)
{
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = YT_REGEX.test(data.url)
        if(!isYt)
        {
            return NextResponse.json({
                message: "Wrong url format"
            },{
                status: 411
            })
        }

        const extractedId = data.url.split("?v=")[1]; // returns an array of string before "?v=" and after;
        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        const Thumbnails = res.thumbnail.thumbnails;
        Thumbnails.sort((a:{width:number},b:{width:number})=> a.width<b.width ? -1 : 1);
        const vidtitle = res.title;

       const stream = await prismaClient.stream.create({
           data:{
            userId: data.creatorId,
            url: data.url,
            extractedId,
            type: "Youtube",
            title: vidtitle ?? "Can't Find Video",
            smalImg: Thumbnails.length>1 ? Thumbnails[Thumbnails.length -2].url : Thumbnails[Thumbnails.length-1].url ,
            bigImg: Thumbnails[Thumbnails.length - 1].url ?? ""

           }
        })

        return NextResponse.json({
            message: "Added Stream",
            id: stream.id
        })
    } catch (error) {
        return NextResponse.json({
        message: "Error While Creating Stream"
        },{
            status: 411
        })
    }

}

export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams = await prismaClient.stream.findMany({
        where:{
            userId: creatorId ?? ""
        }
    })
}