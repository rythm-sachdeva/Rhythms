import Appbar from "./Components/Appbar";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import {UsersIcon, RadioIcon, HeadphonesIcon } from "lucide-react"
import { Redirect } from "./Components/Redirect";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
    <Appbar/>
    <Redirect/>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-purple-700 via-pink-600 to-blue-500">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Let Your Fans Choose the Beat
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Rhythms: Where creators and fans unite to create the perfect streaming soundtrack.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-purple-700 shadow transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  href="#"
                >
                  Get Started
                </Link>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md border border-white bg-transparent px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  href="#"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-purple-400">Key Features</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center bg-gray-700 p-6 rounded-lg">
                <UsersIcon className="h-12 w-12 mb-4 text-pink-500" />
                <h3 className="text-xl font-bold mb-2 text-purple-300">Fan Engagement</h3>
                <p className="text-gray-300">Boost interaction by letting fans pick the music.</p>
              </div>
              <div className="flex flex-col items-center text-center bg-gray-700 p-6 rounded-lg">
                <RadioIcon className="h-12 w-12 mb-4 text-blue-500" />
                <h3 className="text-xl font-bold mb-2 text-purple-300">Live Streaming</h3>
                <p className="text-gray-300">Seamless integration with popular streaming platforms.</p>
              </div>
              <div className="flex flex-col items-center text-center bg-gray-700 p-6 rounded-lg">
                <HeadphonesIcon className="h-12 w-12 mb-4 text-purple-500" />
                <h3 className="text-xl font-bold mb-2 text-purple-300">Music Library</h3>
                <p className="text-gray-300">Access to millions of tracks for your stream.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-purple-400">How It Works</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-pink-600 text-white flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h3 className="text-xl font-bold mb-2 text-purple-300">Create Your Stream</h3>
                <p className="text-gray-400">Set up your stream and connect your FanTune account.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h3 className="text-xl font-bold mb-2 text-purple-300">Fans Join and Vote</h3>
                <p className="text-gray-400">Your audience joins the stream and votes for songs.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h3 className="text-xl font-bold mb-2 text-purple-300">Music Plays Automatically</h3>
                <p className="text-gray-400">Top voted songs play on your stream automatically.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-700 via-pink-600 to-blue-500">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Amplify Your Stream?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl">
                  Join Rhythms today and give your audience the power to create the perfect soundtrack for your content.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1 bg-white text-gray-900" placeholder="Enter your email" type="email" />
                  <Button type="submit" className="bg-purple-700 text-white hover:bg-purple-600">Sign Up</Button>
                </form>
                <p className="text-xs text-gray-300">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2 hover:text-white" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-700 bg-gray-800">
        <p className="text-xs text-gray-400">© 2024 Rhythms. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:text-purple-400 transition-colors" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:text-purple-400 transition-colors" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
