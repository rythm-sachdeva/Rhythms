"use client"
import StreamView from '../components/StreamView'
import { useAppSelector } from '@/lib/hooks'





export default function Component() {

    const userId = useAppSelector((state)=> state.user);

    console.log(userId);
  
    return <StreamView creatorId={userId} playVideo={true} />
}