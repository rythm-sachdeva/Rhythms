"use client"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Play, Pause } from "lucide-react"
import axios from 'axios'
import { YT_REGEX } from '../lib/utils'
import LiteYoutubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'


import { ColumnSpacingIcon } from '@radix-ui/react-icons'
import { boolean } from 'zod'

const REFRESH_INTERVAL= 10*1000;
const creatorId = 'e5e31405-3c4a-4017-a200-b60983dc246b';
interface Video{
  "id":string,
  "url":string,
  "extractedId": string,
  "type": string,
  "title":string,
   "votes": number,
  "smalImg": string,
  "bigiImg":String,
  "haveUpvoted":boolean
  
}

export default  function StreamView() {
  const [videoUrl, setVideoUrl] = useState('')
  const [imagePreview,setImagePreview] = useState('')
  const [queue, setQueue] = useState<Video[]>([])
  const [currentVideo, setCurrentVideo] = useState({
    id: 0,
    title: "Current Song",
    thumbnail: "/placeholder.svg?height=270&width=480"
  })
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading,setLoading] = useState(false);
  
  
  async function refreshstreams()
  {
    const res = await fetch(`/api/streams/?creatorId=${creatorId}`,{
        credentials:"include"
    });
    const json = await res.json();
    setQueue(json.streams.sort((a:any,b:any)=> a.upvote<b.upvote ? 1 : -1))

  }
  const updateImage= async ( s : string )=>
  {
    const isYt = YT_REGEX.test(s);

   if(isYt)
     {
      const extractedId = s.split("?v=")[1]; 
      setLoading(true);
      const data = await axios.get(`/api/previewImage/${extractedId}`);
      setLoading(false);
      setImagePreview(data.data.bigImg.url)
     }
  }
 

  useEffect(()=>{
    refreshstreams();
    const interval = setInterval(()=>{
      refreshstreams();
    },REFRESH_INTERVAL)
  },[]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    const extractedId = videoUrl?.split("?v=")[1]; 
    const res = await axios.get(`/api/previewImage/${extractedId}`)
   
    const data = await fetch('/api/streams',{method:'POST',body:JSON.stringify({creatorId,url:videoUrl})})
    const strResponse = await data.json();
    // console.log(strResponse);
    const nevideo : Video = {
      id  : strResponse.id,
      url : videoUrl,
      extractedId:extractedId,
      type:"video",
      title: res?.data?.title ?? "",
      smalImg:res.data.smallImg.url,
      bigiImg: res.data.bigImg.url,
      votes:0,
      haveUpvoted:false
    }
    setQueue([...queue,nevideo]);
    setVideoUrl('');
    setLoading(false);
  }

  const handleVote = (id: string, increment: number) => {
    setQueue(queue.map(item => 
      item.id === id ? { ...item, votes: item.votes + increment , haveUpvoted: !item.haveUpvoted} : item
    ).sort((a, b) => b.votes - a.votes))

    fetch(`/api/streams/${increment===1? "upvote" : "downvotes"}`,{
      method:'POST',
      body: JSON.stringify({
        streamId: id
      })
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-400">Stream Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-purple-400">Current Song</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden mb-4">
              {videoUrl && videoUrl.match(YT_REGEX) && (<LiteYoutubeEmbed title="Curent Song" id={videoUrl.split("?v=")[1]}/>)}
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{currentVideo.title}</h3>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-purple-400">Add to Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="url"
                placeholder="Paste YouTube URL here"
                value={videoUrl}
                onChange={(e) => {setVideoUrl(e.target.value)
                  updateImage(e.target.value);
                }}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Add to Queue
              </Button>
            </form>
            {videoUrl && (
              <div className="mt-4 aspect-video bg-gray-700 rounded-lg overflow-hidden">
                {!loading &&
                 (<img src={imagePreview} alt="" className="w-full h-full object-cover" />)
                }
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-purple-400">Upcoming Songs</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {queue.map((item) => (
              <li key={item.id} className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg">
                <img src={item.smalImg} alt={item.title} className="w-20 h-15 object-cover rounded" />
                <div className="flex-grow">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-gray-400">Upvotes:{item.votes}</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    disabled={(item.haveUpvoted)}
                    onClick={() => handleVote(item.id, 1)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    disabled={!item.haveUpvoted}
                    onClick={() => handleVote(item.id, -1)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}