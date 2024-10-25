"use client";
import { SessionProvider } from "next-auth/react";
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store'

export function Providers({ children }: {
    children: React.ReactNode
}) {
    const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }
    return (
    <Provider store={storeRef.current}>
    <SessionProvider>
        {children}
    </SessionProvider>
    </Provider>
    )
}