import { Plus, SendHorizontal, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { messageStore } from "../store/messagesStore";
import { authStore } from "../store/userAuthStore";

export default function sendingMessage() {

    const { sendMessage , setActiveTab , isTranslation } = messageStore()
    const { accessToken } = authStore()

    const [text, setText] = useState<string>("")
    const [Img, setImg] = useState<string>("")

    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const send = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!text.trim() && !Img) return
        setText("")
        setImg("")

        if (fileInputRef.current) fileInputRef.current.value = ""

        const tempText = text
        const tempImg = Img
        setActiveTab("chats")

        if (!accessToken) return

        const res = await sendMessage({ Text: tempText, Image: tempImg , translation : isTranslation }, accessToken)

        if (!res.success) toast.error(res.message || "somthig wrong please refresh")

    }
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file?.type.startsWith("image/")) {
            toast.error("please select the Image !!")
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            if (typeof reader.result === "string") {
                setImg(reader.result)
            }
        }
        reader.readAsDataURL(file)
    }

    const removeImage = () => {
        setImg("")
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    return (
        <div className={` ${Img ? "h-40 xs:h-50" : "h-10 xs:h-12 xsm:h-14"} flex flex-col justify-between gap-4 bg-linear-to-r from-gray-600/30 to-gray-700/30 rounded-2xl border border-[#179c8f]/25 items-center px-2 xs:px-3 py-1.5 xs:py-2 shadow-[0_-5px_20px_rgba(0,255,255,0.15)]`}>
            {Img &&
                <div className="h-30 xsm:h-32 w-full border-b-2 pb-4 border-white/20 transition-all duration-200">
                    <div className="h-full w-fit relative">
                        <img src={Img} alt="pic" className="max-h-full w-auto object-contain " />
                        <X onClick={removeImage} className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 transition-all duration-200 p-1 rounded-full cursor-pointer" />
                    </div>
                </div>
            }
            <form onSubmit={send} className="flex justify-between items-center gap-3 xs:gap-5 h-8 xsm:h-10 w-full ">
                <div className="flex flex-1 gap-2 xs:gap-3">
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-500/30 size-6 xs:size-8 xsm:size-10 p-1 xsm:p-2 rounded-xl xsm:rounded-2xl cursor-pointer hover:bg-gray-500/50 transition-all duration-200 flex justify-center items-center">
                        <Plus />
                    </div>
                    <input
                        value={text}
                        type="text"
                        onChange={(e) => {
                            e.preventDefault()
                            setText(e.target.value)
                        }}
                        placeholder="Type the message ....." className="flex-1 outline-0 text-sm xs:text--base " />
                </div>
                <button 
                type="submit" 
                disabled = {!text.trim() && !Img}
                className="bg-[#2dc4b5] cursor-pointer hover:bg-[#179c8f] transition-all duration-200 px-2 xs:px-3 xsm:px-4 py-1.5 xsm:py-2 rounded-lg xs:rounded-xl xsm:rounded-2xl flex items-center gap-2 disabled:bg-[#2dc4b5]/40 disabled:cursor-not-allowed">
                    <span className="text-black font-dosis font-bold hidden xsm:block">Send</span>
                    <SendHorizontal className='text-black size-3.5 xs:size-4.5 xsm:size-4' />
                </button>
            </form>
        </div>
    )
}