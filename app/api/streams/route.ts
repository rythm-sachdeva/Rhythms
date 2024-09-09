import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "../../lib/db";
import { YT_REGEX } from "../../lib/utils";


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

        prismaClient.Stream.create({
            userId: data.creatorId,
            url: data.url
        })
    } catch (error) {
        return NextResponse.json({
        message: "Error While Creating Stream"
        },{
            status: 411
        })
    }

}