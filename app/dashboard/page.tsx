"use client"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Play, Pause } from "lucide-react"
import axios from 'axios'

const REFRESH_INTERVAL= 10*1000;

export default function Dashboard() {
  const [videoUrl, setVideoUrl] = useState('')
  const [queue, setQueue] = useState([
    { id: 1, title: "Song 1", votes: 5, thumbnail: "/placeholder.svg?height=90&width=120" },
    { id: 2, title: "Song 2", votes: 3, thumbnail: "/placeholder.svg?height=90&width=120" },
    { id: 3, title: "Song 3", votes: 2, thumbnail: "/placeholder.svg?height=90&width=120" },
  ])
  const [currentVideo, setCurrentVideo] = useState({
    id: 0,
    title: "Current Song",
    thumbnail: "/placeholder.svg?height=270&width=480"
  })
  const [isPlaying, setIsPlaying] = useState(true)
  
  async function refreshstreams()
  {
    const res = await axios.get('/api/streams/mystream')
  }


  useEffect(()=>{
    refreshstreams();
    const interval = setInterval(()=>{

    },REFRESH_INTERVAL)
  },[]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newVideo = {
      id: queue.length + 1,
      title: `New Song ${queue.length + 1}`,
      votes: 0,
      thumbnail: "/placeholder.svg?height=90&width=120"
    }
    setQueue([...queue, newVideo])
    setVideoUrl('')
  }

  const handleVote = (id: number, increment: number) => {
    setQueue(queue.map(item => 
      item.id === id ? { ...item, votes: item.votes + increment } : item
    ).sort((a, b) => b.votes - a.votes))

    fetch('/api/streams/upvote',{
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
              <img src={currentVideo.thumbnail} alt={currentVideo.title} className="w-full h-full object-cover" />
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
                onChange={(e) => setVideoUrl(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Add to Queue
              </Button>
            </form>
            {videoUrl && (
              <div className="mt-4 aspect-video bg-gray-700 rounded-lg overflow-hidden">
                <img src="/placeholder.svg?height=180&width=320" alt="Video preview" className="w-full h-full object-cover" />
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
                <img src={item.thumbnail} alt={item.title} className="w-20 h-15 object-cover rounded" />
                <div className="flex-grow">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-gray-400">Votes: {item.votes}</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleVote(item.id, 1)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
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