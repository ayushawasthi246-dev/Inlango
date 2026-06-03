import { useEffect, useRef } from "react"
import { messageStore } from "../store/messagesStore.tsx"
import { authStore } from "../store/userAuthStore.tsx"
import NoMessages from "./noMessage.tsx"
import MessagesLoadingSkeleton from '../components/messageLoadingSkeleton.tsx'
import MsgTemplate from "./messgaeTemplate.tsx"

export default function messagesList() {

    const { isMessageloading, messages, activeChatPartner, chatPartnerMessages, subscribeToMessage, unSubscribeToMessage } = messageStore()
    const { accessToken, userData } = authStore()

    useEffect(() => {
        const ChatMessages = async () => {
            if (activeChatPartner && accessToken) {
                await chatPartnerMessages(activeChatPartner._id, accessToken)
            }
        }

        ChatMessages()
    }, [activeChatPartner])

    useEffect(() => {
        subscribeToMessage()

        return () => {
            unSubscribeToMessage()
        }
    }, [activeChatPartner])

    const messageEndRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const timeout = setTimeout(() => {
            messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);

        return () => clearTimeout(timeout);
    }, [messages]);

    if (isMessageloading) return <MessagesLoadingSkeleton />
    if (messages.length === 0) return <NoMessages />

    return (
        <div className="h-full flex flex-col gap-3">
            {messages.map((msg) => (
                <MsgTemplate
                    msg={msg}
                    isMe={msg.SenderID == userData?._id}
                />
            ))}

            <div ref={messageEndRef} />
        </div>
    )
}