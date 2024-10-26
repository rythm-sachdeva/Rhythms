import { Copy, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function DialogCloseButton({creatorId
}:{creatorId:string}) {
  const [link,setlink] = useState("");
  const handleShare = () => {
    const protocol = window.location.protocol=== "http:" ? "http:" : "https:"
    const shareableLink = protocol +`//${window.location.hostname}/creator/${creatorId}`;
    setlink(shareableLink);
  }

  const handleClick = () =>{
    navigator.clipboard.writeText(link).then(()=>{
      toast.success('Link Copied SuccessFully',{
        position:'top-center',
        autoClose:3000,
        hideProgressBar:false,
        closeOnClick:true,
        draggable:true,
        pauseOnHover:true,
        progress:undefined,
      })
    },(err)=>{
      toast.error('Failed To copy link',{
        position:'top-center',
        autoClose:3000,
        hideProgressBar:false,
        closeOnClick:true,
        draggable:true,
        pauseOnHover:true,
        progress:undefined
      })
    })
  }
  return (
    <>
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-purple-700 hover:bg-purple-800 text-white" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              value={link}
              defaultValue=""
              readOnly
            />
          </div>
          <Button onClick={handleClick} type="submit" size="sm" className="px-3 bg-purple-700 hover:bg-purple-800 text-white ">
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="bg-purple-700 hover:bg-purple-800 text-white">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
      </Dialog>
    <ToastContainer/>
    </>
    
  )
}
