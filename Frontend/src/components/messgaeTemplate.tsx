import { memo, useState } from "react";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { authStore } from "../store/userAuthStore";
import { messageStore } from "../store/messagesStore";
import toast from "react-hot-toast";

type data = {
    msg: any,
    isMe: boolean,
    onDelete?: (id: string) => void
}

function MsgTemplate({ msg, isMe }: data) {
    const { deleteMessage } = messageStore()
    const { accessToken } = authStore()
    const [showTranslation, setShowTranslation] = useState(false);

    const canDelete = msg.status !== "sending" && isMe ;

    const deleteMsg = async(msgID : string) => {
        if (!accessToken) return
        const res = await deleteMessage(msgID , accessToken)
        if(res.message){
            if(!res.success){
                toast.error(res.message)
            }
        }
    }

    return (
        <div key={msg._id} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
            <div className="flex items-end gap-1.5">

                <div className={`contents ${isMe ? "order-last" : "order-first"}`}>
                    <div className={`chat-bubble flex flex-col gap-2 rounded-2xl py-3 max-w-52 xsm:max-w-60 sm:max-w-80 md:max-w-100 max-h-72 xs:max-h-96 xsm:max-h-90 sm:max-h-100 md:max-h-125 ${isMe ? "bg-[#2dc4b5]/40 rounded-br-none" : "bg-gray-700/50 rounded-bl-none"}`}>
                        {msg.Image && <img src={msg.Image} alt="Photo" className="max-w-96 max-h-32 xs:max-h-56 object-contain rounded-xl" />}

                        <span className="overflow-auto text-sm sm:text-base">{isMe && msg.TranslatedText ? msg.Text : (msg.TranslatedText || msg.Text)}</span>

                        <div className={`${showTranslation && msg.TranslatedText ? "" : "hidden"} overflow-auto text-sm sm:text-base border-t border-white/10 pt-3 mt-2`}>
                            <span className="">{isMe && msg.TranslatedText ? msg.TranslatedText : msg.Text}</span>
                        </div>

                        <div className="flex justify-between gap-3">
                            <span className={`text-[10px] sm:text-xs text-white/70 ${isMe ? "self-start" : "self-end"}`}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                            <div className="flex items-center gap-2">
                                <span className={`loading loading-spinner ${msg.status === "sending" ? "" : "hidden"} loading-xs size-3`}></span>
                                <span className={`text-[10px] sm:text-xs capitalize ${msg.status === "failed" ? "text-red-400" : "text-white/60"}`}>{msg.status}</span>
                                <span onClick={() => setShowTranslation(!showTranslation)} className={`text-[10px] sm:text-xs capitalize text-white/60 hover:text-white transition-all duration-200 cursor-pointer ${msg.status != "sending" && msg.status != "failed" && msg.TranslatedText ? "" : "hidden"}`}>{showTranslation ? "Hide Translation" : "Show Translation"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {canDelete && (
                    <div className={`dropdown dropdown-top xs:dropdown-left xs:dropdown-end transition-opacity duration-200 order-first`}>
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle btn-xs text-white/40 hover:text-white hover:bg-white/10 flex items-center justify-center size-7"
                        >
                            <EllipsisVertical className="size-4" />
                        </div>

                        <ul tabIndex={0} className="dropdown-content menu xs:-translate-y-4 p-1 shadow-2xl bg-base-300 rounded-xl md:w-32 border border-white/5 z-50 backdrop-blur-md mt-1">
                            <li>
                                <button
                                    onClick={() => deleteMsg(msg._id)}
                                    className="text-red-400 hover:bg-red-500/20 rounded-lg active:bg-red-500/30 text-xs py-2 flex items-center gap-2"
                                >
                                    <Trash2 className="size-3.5" />
                                    <span>Delete</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                )}

            </div>
        </div>
    );
}

export default memo(MsgTemplate);