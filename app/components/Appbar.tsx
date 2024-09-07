"use client";
import { signIn, signOut, useSession } from 'next-auth/react'

const Appbar = () => {
    const session = useSession();

  return (
   <div className="flex justify-between ">
    <div>
        Rhythms
    </div>
    <div>

        {session.data?.user &&  <button onClick={()=>signOut()}>Sign out</button>}
        {!session.data?.user && <button onClick={()=>signIn()}>Sign in with Google</button> }
    </div>

   </div>
  )
}

export default Appbar