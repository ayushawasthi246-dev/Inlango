import { useEffect } from "react"
import { messageStore } from "../store/messagesStore.tsx"
import { authStore } from "../store/userAuthStore.tsx"
import { X } from 'lucide-react'
import toast from "react-hot-toast"

export default function mediaList() {

    const { getMedia, setShowMedia, media } = messageStore()
    const { accessToken } = authStore()

    useEffect(() => {
        const gettingMedia = async () => {
            if (accessToken) {
                const res = await getMedia(accessToken)
                if (!res.success) toast.error(res.message || "Somethign went wrong")
            }
        }
        gettingMedia()
    }, [accessToken, getMedia])

    return (
        <div className="h-full flex flex-col border border-white/20 rounded-2xl bg-black">
            <div className="flex items-center justify-between bg-linear-to-r from-gray-600/30 to-gray-700/30 w-full rounded-t-2xl px-3 xsm:px-4 py-2.5 xsm:py-4 border-b border-white/20">
                <div className="flex flex-col gap-0.5">
                    <span className="text-base xsm:text-lg">Media</span>
                    <span className="text-xs xsm:text-sm text-white/50">Media from all chats</span>
                </div>
                <X onClick={()=>setShowMedia(false)} className="size-8 xsm:size-10 p-1.5 hover:bg-white/15 transition-all duration-200 rounded-xl cursor-pointer" />
            </div>
            <div className="flex-1 flex justify-start flex-wrap overflow-auto gap-3 p-3 xsm:p-5">
                {media.map((media) => (
                    <div key={media._id}>
                        <img src={media.Image} alt="Image" className="size-32 xsm:size-44 border rounded-lg object-cover border-white/40" />
                    </div>
                ))}
            </div>
        </div>
    )
}