import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "../../../lib/db";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
    const session = await getServerSession();
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email || undefined  
        }
    });

    if(!user){
        return NextResponse.json({
            message: "Unauthenticated"
        },
    {
        status: 403
    })
    }

   try {
     const mostUpvotedStream = await prismaClient.stream.findFirst({
         where:{
             userId: user.id,
             played:false
         },
         orderBy: {
             upvotes:{
                 _count:'desc'
             }
         }
     })
 
     await Promise.all([prismaClient.currentStream.upsert({
      where:{
         userId: user.id
      }, 
      update:{
      streamId: mostUpvotedStream?.id 
      },
      create:{
       userId: user.id,
       streamId: mostUpvotedStream?.id
      }
     }), prismaClient.stream.update({
         where: {id : mostUpvotedStream?.id ?? ""},
         data:{played : true,
              playedTs: new Date()
         }
     })])
 
     return NextResponse.json({stream:mostUpvotedStream});
   } catch (error: any) {
    console.log(error.message)
   }
    
}