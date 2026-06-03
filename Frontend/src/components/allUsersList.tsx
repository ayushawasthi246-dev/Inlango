import { useEffect, useState } from "react"
import { messageStore } from "../store/messagesStore.tsx"
import UsersLoadingSkeleton from "./userLoadingSkeleton.tsx"
import { authStore } from "../store/userAuthStore.tsx"
import { CircleUser, Search } from 'lucide-react'
import toast from "react-hot-toast"
import NoUser from "./noUser.tsx"
import NoQueyUserFound from "./noQueryUser.tsx"

export default function usersList() {

    const { getallUsers, isUserLoading, allUsers, setActiveChatPartner, activeChatPartner , addChatPartner } = messageStore()
    const { accessToken, onlineUser } = authStore()

    const [query, setQuery] = useState<string>("")

    const filterUsers = allUsers.filter((partner) => (
        partner.Username.toLowerCase().startsWith(query.toLowerCase())
    ))

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }

    useEffect(() => {
        const gettingUsers = async () => {
            if (accessToken) {
                const res = await getallUsers(accessToken)
                if (!res.success) toast.error(res.message || "Somethign went wrong")
            }
        }
        gettingUsers()
    }, [accessToken, getallUsers])

    if (isUserLoading) return <UsersLoadingSkeleton />
    if (allUsers.length === 0) return <NoUser />

    return (
        <>
            <label className="input w-full h-8 xsm:h-10 rounded-xl bg-linear-to-r from-gray-500/30 to-gray-600/30 border border-white/10 outline-none ring-0">
                <Search className='text-white/60 size-4 xsm:size-6' />
                <input
                    type="search"
                    onChange={handleInput}
                    placeholder="Search" />
            </label>
            {allUsers.length !== 0 && filterUsers.length === 0 ?
                <NoQueyUserFound />
                :
                <div className="flex flex-col gap-3">
                    {allUsers.map((partner) => (
                        <div key={partner._id}
                            onClick={() => {
                                setActiveChatPartner(partner)
                                addChatPartner(partner)
                            }}
                            className={`flex items-center border-2 ${activeChatPartner?._id === partner._id ? "border-[#2f978c]/40 bg-gray-700/30" : "hover:bg-gray-700/40 border-transparent"} gap-3 cursor-pointer px-2.5 xsm:px-3 py-2 xsm:py-2.5 rounded-xl transition-all duration-200 `}>
                            <div className={`size-7.5 xsm:size-9.5 sm:size-11 avatar ${onlineUser.includes(partner._id) ? "avatar-online" : "avatar-offline"} rounded-full`}>
                                {partner.ProfilePic === "" ?
                                    <CircleUser className="size-full object-cover stroke-1" /> :
                                    <img src={partner.ProfilePic} alt="Profilie pic" className="rounded-full object-cover size-full overflow-hidden" />
                                }
                            </div>
                            <div className="flex-1 truncate">
                                <div className="tracking-wide font-Padauk font-semibold text-xs xsm:text-sm md:text-base">{partner.Username}</div>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}