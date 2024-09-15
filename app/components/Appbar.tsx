"use client";
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link';
import { MusicIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Appbar = () => {
    const session = useSession();

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-gray-800">
    <Link className="flex items-center justify-center" href="#">
      <MusicIcon className="h-6 w-6 text-purple-400" />
      <span className="ml-2 text-xl font-bold text-purple-400">Rhythms</span>
    </Link>
    <nav className="ml-auto flex gap-4 sm:gap-6">
    {session.data?.user &&  <Button className="bg-blue-500 hover:bg-blue-700" onClick={()=>signOut()}>Sign out</Button>}
    {!session.data?.user && <Button className="bg-blue-500 hover:bg-blue-700" onClick={()=>signIn("google")}>Sign in</Button> }
    </nav>
  </header>
  )
}

export default Appbar