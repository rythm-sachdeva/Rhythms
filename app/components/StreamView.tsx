"use client"
import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
//@ts-ignore
import { ChevronUp, ChevronDown, Play, Plus } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Appbar } from '../components/Appbar'
import { YT_REGEX } from '../lib/utils'
//@ts-ignore
import YouTubePlayer from 'youtube-player';
import Dialog from './Modal'
import SearchResults from './SearchDebounce'

interface Video {
    "id": string,
    "type": string,
    "url": string,
    "extractedId": string,
    "title": string,
    "smallImg": string,
    "bigImg": string,
    "active": boolean,
    "userId": string,
    "upvotes": number,
    "haveUpvoted": boolean
}
interface VideoQueueItem {
    id: string;
    type: 'video';
    title: string;
    channelTitle: string;
    isLive: boolean;
    thumbnail: {
        thumbnails: {
            url: string;
            width: number;
            height: number;
        }[];
    };
    shortBylineText: {
        runs: {
            text: string;
            navigationEndpoint: {
                clickTrackingParams: string;
                commandMetadata: {
                    webCommandMetadata: {
                        url: string;
                        webPageType: string;
                        rootVe: number;
                        apiUrl: string;
                    };
                };
                browseEndpoint: {
                    browseId: string;
                    canonicalBaseUrl: string;
                };
            };
        }[];
    };
    length: {
        accessibility: {
            accessibilityData: {
                label: string;
            };
        };
        simpleText: string;
    };
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function StreamView({
    creatorId,
    playVideo = false
}: {
    creatorId: string;
    playVideo: boolean;
}) {
    const [inputLink, setInputLink] = useState('')
    const [queue, setQueue] = useState<Video[]>([])
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
    const [loading, setLoading] = useState(false);
    const [playNextLoader, setPlayNextLoader] = useState(false);
    const videoPlayerRef = useRef<HTMLDivElement>(null);
    const [useAi, setUseAi] = useState(false)
    const [tentativeQueue, setTentativeQueue] = useState<VideoQueueItem[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);


    async function refreshStreams() {
        const res = await fetch(`/api/streams/?creatorId=${creatorId}`, {
            credentials: "include"
        });
        const json = await res.json();
        setQueue(json?.streams?.sort((a: any, b: any) => b.upvotes - a.upvotes));

        setCurrentVideo(video => {
            if (video?.id === json.activeStream?.stream?.id) {
                return video;
            }
            return json?.activeStream?.stream
        });
    }

    useEffect(() => {
        refreshStreams();
        const interval = setInterval(() => {
            refreshStreams();
        }, REFRESH_INTERVAL_MS)
        return () => clearInterval(interval);
    }, [creatorId])

    useEffect(() => {
        if (!videoPlayerRef.current || !currentVideo?.extractedId) {
            return;
        }
        let player = YouTubePlayer(videoPlayerRef.current);

        player.loadVideoById(currentVideo.extractedId);

        if (playVideo) {
            player.playVideo();
        }

        const eventHandler = (event: any) => {
            if (event.data === 0) { // Video ended
                playNext();
            }
        };
        player.on('stateChange', eventHandler);
        return () => {
            player.destroy();
        }
    }, [currentVideo, playVideo])
    const [searchList, setSearchList] = useState([])

    useEffect(() => {
        if (inputLink.trim() === '' || useAi) {
            setSearchList([]);
            return;
        }

        const fetchYouTubeResults = async () => {
            const searchList = await fetch('/api/search', { body: JSON.stringify({ query: inputLink }), method: 'POST' })
            const data = await searchList.json()
            setSearchList(data.items)
        }

        const debounceTimer = setTimeout(() => {
            fetchYouTubeResults();
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [inputLink, useAi])

    const handleClick = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch("/api/streams/", {
                method: "POST",
                body: JSON.stringify({
                    creatorId,
                    id: id
                })
            });
            const data = await res.json();
            if (res.ok) {
                setQueue(prevQueue => [...(prevQueue || []), data].sort((a,b) => b.upvotes - a.upvotes));
                // Remove from tentative queue after successfully adding to the main queue
                setTentativeQueue(prev => prev.filter(video => video.id !== id));
                toast.success("Added to queue!");
            } else {
                toast.error(data.message || "Failed to add video.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setLoading(false);
            setInputLink('');
        }
    }
    const handleAiSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAiLoading(true); // Start AI loading
        setTentativeQueue([]); // Clear previous suggestions
        try {
            const res = await fetch('/api/aiplaylist', {
                method: 'POST',
                body: JSON.stringify({ text: inputLink })
            })
            const data = await res.json()
            setTentativeQueue(data)
        } catch (error) {
            toast.error("Failed to fetch AI playlist.");
        } finally {
            setIsAiLoading(false); // Stop AI loading
            setInputLink('')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputLink.match(YT_REGEX)) {
            toast.error("Please enter a valid YouTube link.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/streams/", {
                method: "POST",
                body: JSON.stringify({
                    creatorId,
                    url: inputLink
                })
            });
            const data = await res.json();
             if (res.ok) {
                setQueue(prevQueue => [...(prevQueue || []), data].sort((a, b) => b.upvotes - a.upvotes));
                toast.success("Added to queue!");
            } else {
                toast.error(data.message || "Failed to add video.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setLoading(false);
            setInputLink('')
        }
    }

    const handleVote = (id: string, isUpvote: boolean) => {
        setQueue(queue.map(video =>
            video.id === id
                ? {
                    ...video,
                    upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
                    haveUpvoted: isUpvote
                }
                : video
        ).sort((a, b) => (b.upvotes) - (a.upvotes)))

        fetch(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
            method: "POST",
            body: JSON.stringify({
                streamId: id
            })
        })
    }

    const playNext = async () => {
        if (queue.length > 0) {
            try {
                setPlayNextLoader(true)
                const data = await fetch('/api/streams/next', {
                    method: "GET",
                })
                const json = await data.json();
                setCurrentVideo(json.stream)
                setQueue(q => q.filter(x => x.id !== json.stream?.id))
            } catch (e) {
                toast.error("Could not play the next video.");
            }
            setPlayNextLoader(false)
        } else {
            toast.info("Queue is empty.");
        }
    }



    return (
        <div className="flex flex-col min-h-screen bg-[rgb(10,10,10)] text-gray-200">
            <Appbar />
            <div className='flex justify-center'>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-5 w-screen max-w-screen-xl pt-8">
                    <div className='col-span-3'>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Upcoming Songs</h2>
                            {(!queue || queue?.length === 0) && tentativeQueue.length === 0 && !isAiLoading && (
                                <Card className="bg-gray-900 border-gray-800 w-full">
                                    <CardContent className="p-4"><p className="text-center py-8 text-gray-400">No videos in queue</p></CardContent>
                                </Card>
                            )}
                            {queue?.map((video) => (
                                <Card key={video.id} className="bg-gray-900 border-gray-800">
                                    <CardContent className="p-4 flex items-center space-x-4">
                                        <img
                                            src={video.smallImg}
                                            alt={`Thumbnail for ${video.title}`}
                                            className="w-30 h-20 object-cover rounded"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-white">{video.title}</h3>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleVote(video.id, !video.haveUpvoted)}
                                                    className="flex items-center space-x-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                                                >
                                                    {video.haveUpvoted ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                                                    <span>{video.upvotes}</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                             {/* AI Loading state */}
                            {isAiLoading && (
                                <Card className="bg-gray-900 border-gray-800">
                                    <CardContent className="p-4 flex justify-center items-center">
                                        <p className="text-gray-400">AI is thinking...</p>
                                    </CardContent>
                                </Card>
                            )}
                            {tentativeQueue.length > 0 && tentativeQueue.map((video) => (<Card key={video.id} className="bg-gray-900 border-gray-800">
                                <CardContent className="p-4 flex items-center space-x-4">
                                    <img
                                        src={video.thumbnail?.thumbnails[0].url}
                                        alt={`Thumbnail for ${video.title}`}
                                        className="w-30 h-20 object-cover rounded"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-white">{`${video?.title?.slice(0, 30)}...`}</h3>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClick(video.id)}
                                        className="flex items-center space-x-2 bg-green-600 text-white border-green-700 hover:bg-green-500"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add</span>
                                    </Button>
                                </CardContent>
                            </Card>))}

                        </div>
                    </div>
                    <div className='col-span-2'>
                        <div className="max-w-4xl mx-auto p-4 space-y-6 w-full">
                            <div className="flex justify-between items-center">
                                <h1 className="text-xl font-bold text-white">Add a song</h1>
                                <div>
                                    <Button onClick={() => {
                                        setUseAi((prev) => !prev)
                                        setInputLink('')
                                    }} className={`w-full ${!useAi ? 'animate-bounce' : ''} bg-inherit border-2 border-purple-700 hover:bg-purple-800 text-white`}>{useAi ? "YT Search" : "Ask Ai"}</Button>
                                </div>
                                <div>
                                    <Dialog creatorId={creatorId} />
                                </div>
                            </div>

                            <form onSubmit={useAi ? handleAiSubmit : handleSubmit} className="space-y-2">
                                {!useAi ? <>
                                    <Input
                                        type="text"
                                        placeholder="Search/Paste YouTube link here"
                                        value={inputLink}
                                        onChange={(e) => setInputLink(e.target.value)}
                                        className="bg-gray-900 text-white border-gray-700 placeholder-gray-500"
                                    />
                                   
                                    <SearchResults isSearching={false} searchList={searchList} 
                                     //@ts-ignore
                                    onSelectSearchResult={handleClick} />
                                    <Button disabled={loading} type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white">{loading ? "Loading..." : "Add to Queue"}</Button>
                                </> : <>
                                    <Input
                                        type="text"
                                        placeholder="e.g. Suggest some chill lofi songs"
                                        value={inputLink}
                                        onChange={(e) => setInputLink(e.target.value)}
                                        className="bg-gray-900 text-white border-gray-700 placeholder-gray-500"
                                    />
                                    <Button disabled={isAiLoading} type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white">{isAiLoading ? "Loading..." : "Ask AI"}</Button>
                                    {tentativeQueue.length > 0 && <Button onClick={() => {
                                        setTentativeQueue([])
                                    }} type="button" className="w-full bg-gray-700 hover:bg-gray-800 text-white mt-2">{"Clear Suggestions"}</Button>}
                                </>}

                            </form>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">Now Playing</h2>
                                <Card className="bg-gray-900 border-gray-800">
                                    <CardContent className="p-4">
                                        {currentVideo ? (
                                            <div>
                                                {playVideo ? <>
                                                    {/* @ts-ignore */}
                                                    <div ref={videoPlayerRef} className='w-full' />
                                                </> : <>
                                                    <img
                                                        src={currentVideo.bigImg}
                                                        alt={`Thumbnail for ${currentVideo.title}`}
                                                        className="w-full h-72 object-cover rounded"
                                                    />
                                                    <p className="mt-2 text-center font-semibold text-white">{currentVideo.title}</p>
                                                </>}
                                            </div>) : (
                                            <p className="text-center py-8 text-gray-400">No video playing</p>
                                        )}
                                    </CardContent>
                                </Card>
                                {playVideo && <Button disabled={playNextLoader} onClick={playNext} className="w-full bg-purple-700 hover:bg-purple-800 text-white">
                                    <Play className="mr-2 h-4 w-4" /> {playNextLoader ? "Loading..." : "Play next"}
                                </Button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}