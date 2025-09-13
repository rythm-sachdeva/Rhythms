import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { YT_REGEX } from "@/app/lib/utils";
import { getServerSession } from "next-auth";




const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.object({
      thumbnails: z.array(
        z.object({
          url: z.string().url(),
          width: z.number().optional(),
          height: z.number().optional(),
        })
      ).optional(),
    }).optional(),
  channel: z.object({
      name: z.string().optional(),
    }).optional(),
  url: z.string().optional(),
});

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    video: videoSchema
    
});



const MAX_QUEUE_LEN = 100;

export async function POST(req: NextRequest) {
    try {

         const data = CreateStreamSchema.parse(await req.json());
        // const res = await youtubesearchapi.GetVideoDetails(extractedId);
       const video = data.video;

        const thumbnails = video.thumbnail?.thumbnails;
        // if(thumbnails) thumbnails.sort((a: {width: number}, b: {width: number}) => a.width < b.width ? -1 : 1);

        const existingActiveStream = await prismaClient.stream.count({
            where: {
                userId: data.creatorId
            }
        })

        if (existingActiveStream > MAX_QUEUE_LEN) {
            return NextResponse.json({
                message: "Already at limit"
            }, {
                status: 411
            })
        }
        const stream = await prismaClient.stream.create({
            data: {
                userId: String(data.creatorId),
                url: video.url ?? `https://www.youtube.com/watch?v=${video.id}`,
                extractedId:video.id,
                type: "Youtube",
                title: video.title ?? "Cant find video",
                //@ts-ignore
                smallImg: (thumbnails?.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url) ?? "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
                //@ts-ignore
                bigImg: thumbnails[thumbnails.length - 1].url ?? "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
                addedById:String(data.creatorId)
            }
        });

        return NextResponse.json({
            ...stream,
            hasUpvoted: false,
            upvotes: 0
        })
    } catch(e) {
        console.log(e);
        return NextResponse.json({
            message: "Error while adding a stream"
        }, {
            status: 411
        })
    }

}

export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const session = await getServerSession();
     // TODO: You can get rid of the db call here 
     const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    });

    if (!user) {
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        })
    }

    if (!creatorId) {
        return NextResponse.json({
            message: "Error"
        }, {
            status: 411
        })
    }

    const [streams, activeStream] = await Promise.all([await prismaClient.stream.findMany({
        where: {
            userId: creatorId,
            played: false
        },
        include: {
            _count: {
                select: {
                    upvotes: true
                }
            },
            upvotes: {
                where: {
                    userId: user.id
                }
            }
        }
    }), prismaClient.currentStream.findFirst({
        where: {
            userId: creatorId
        },
        include: {
            stream: true
        }
    })])

    return NextResponse.json({
        streams: streams.map(({_count, ...rest}) => ({
            ...rest,
            upvotes: _count.upvotes,
            haveUpvoted: rest.upvotes.length ? true : false
        })),
        activeStream
    })
}
 