import { useEffect, useState } from "react"
import { messageStore } from "../store/messagesStore.tsx"
import UsersLoadingSkeleton from "./userLoadingSkeleton.tsx"
import { authStore } from "../store/userAuthStore.tsx"
import { CircleUser, Search } from 'lucide-react'
import NoQueyUserFound from "./noQueryUser.tsx"
import NoUser from "./noUser.tsx"

export default function chatList() {

    const { getAllChats, isUserLoading, allChatPartner, setActiveChatPartner, activeChatPartner ,subscribeToMessage , unSubscribeToMessage } = messageStore()
    const { accessToken, onlineUser } = authStore()

        useEffect(() => {
            subscribeToMessage();
    
            return () => {
                unSubscribeToMessage();
            };
        }, []);
    

    const [query, setQuery] = useState<string>("")

    const filterChatPartners = allChatPartner.filter((partner) => (
        partner.Username.toLowerCase().startsWith(query.toLowerCase())
    ))

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }

    useEffect(() => {
        if (accessToken) getAllChats(accessToken)
    }, [accessToken, getAllChats])

    if (isUserLoading) return <UsersLoadingSkeleton />
    if (allChatPartner.length === 0) return <NoUser />

    return (
        <>
            <label className="input w-full h-8 xsm:h-10 rounded-xl bg-linear-to-r from-gray-500/30 to-gray-600/30 border border-white/10 outline-none ring-0">
                <Search className='text-white/60 size-4 xsm:size-6' />
                <input
                    type="search"
                    onChange={handleInput}
                    placeholder="Search"/>
            </label>
            {allChatPartner.length !== 0 && filterChatPartners.length === 0 ?
                <NoQueyUserFound />
                :
                <div className="flex-1 min-h-0 flex flex-col gap-3">
                    {filterChatPartners.map((partner) => (
                        <div key={partner._id}
                            onClick={() => setActiveChatPartner({ ...partner })}
                            className={`flex items-center border-2 ${activeChatPartner?._id === partner._id ? "border-[#2f978c]/40 bg-gray-700/30" : "hover:bg-gray-700/40 border-transparent"} gap-3 cursor-pointer px-2.5 xsm:px-3 py-2 xsm:py-2.5 rounded-xl transition-all duration-200 `}>
                            <div className={`size-7.5 xsm:size-9.5 sm:size-11 avatar ${onlineUser.includes(partner._id) ? "avatar-online" : "avatar-offline"} rounded-full`}>
                                {partner.ProfilePic === "" ?
                                    <CircleUser className="size-full object-cover stroke-1" /> :
                                    <img src={partner.ProfilePic} alt="Profilie pic" className="rounded-full object-cover size-full overflow-hidden" />
                                }
                            </div>
                            <div className="flex-1 truncate text-ellipsis">
                                <div className="tracking-wide font-Padauk font-semibold text-xs xsm:text-sm md:text-base ">{partner.Username}</div>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}