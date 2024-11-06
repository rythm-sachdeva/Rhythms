"use client"
import StreamView from '../components/StreamView'
import { useAppSelector } from '@/lib/hooks'





export default function Component() {

    const creatorId = useAppSelector((state)=> state.user);
  
    return <StreamView creatorId={creatorId} playVideo={true} />
}