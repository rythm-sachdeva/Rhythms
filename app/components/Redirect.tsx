"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect } from "react"
import { useAppDispatch } from "@/lib/hooks";
import { setUserId } from "@/lib/slices/user/user";



async function getuser()
{
    const response = await fetch('/api/user');
    const data = await response.json();
    return data.userId;
}

export function Redirect() {
    const session = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();
    

    useEffect(() => {
        if (session?.data?.user) {
           getuser().then(value=>
           {
            dispatch(setUserId(String(value)))
           }
           );
            router.push("/dashboard");
        }
    }, [session])
    return null
}