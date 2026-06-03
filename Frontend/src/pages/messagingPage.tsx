import { MessageCircle, Search, Images, CircleUser, LogOut, ArrowLeft } from 'lucide-react'
import ChatList from '../components/chatList.tsx'
import UsersList from '../components/allUsersList.tsx'
import UserSetting from '../components/UserSetting.tsx'
import { useEffect, useRef } from 'react'
import { authStore } from '../store/userAuthStore.tsx'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { messageStore } from '../store/messagesStore.tsx'
import NoActiveChat from '../components/noActiveChat.tsx'
import MessagesList from '../components/messagesList.tsx'
import PageLoader from '../components/pageLoader.tsx'
import SendingMessage from '../components/messageSending.tsx'
import MediaList from '../components/media.tsx'

export default function Messaging() {

    const navigate = useNavigate()
    const { checkAuth, markDeclaimerSeen, isAuthChecking, onlineUser, userData, logout , accessToken } = authStore()
    const { activeChatPartner, setActiveChatPartner, setActiveTab, activeTab, isShowMedia, setShowMedia, setIsTranslation, isSidebarOpen, setIsSidebarOpen , getallUsers } = messageStore()

    const mediaRef = useRef<HTMLDivElement | null>(null)
    const sidebarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const checkingAuth = async () => {
            const res = await checkAuth()
            if (!res.success) {
                toast.error(res.message || "User not exists")
                navigate("/")
            }
        }
        checkingAuth()
    }, [checkAuth, navigate])

    useEffect(() => {
    const gettingUsers = async () => {
        if (accessToken) {
            const res = await getallUsers(accessToken);
            if (!res.success) {
                toast.error(res.message || "Something went wrong");
            }
        }
    };
    gettingUsers();
}, [accessToken])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 || window.innerWidth < 500) {
                if (activeTab === null) {
                    setActiveTab("chats");
                    setIsSidebarOpen(true)
                }
            }
        }
        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (window.innerWidth < 500 || window.innerWidth >= 1024) return;

            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsSidebarOpen(false);
                setActiveTab(null)
            }
        }
        if (
            isSidebarOpen &&
            window.innerWidth >= 500 &&
            window.innerWidth < 1024
        ) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mediaRef.current && !mediaRef.current.contains(event.target as Node)) {
                setShowMedia(false);
            }
        }
        if (isShowMedia) document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        };
    }, [isShowMedia])

    const Logout = async () => {
        const res = await logout()
        if (res.message) {
            if (res.success) {
                navigate("/")
                toast.success(res.message)
            } else {
                toast.error(res.message)
            }
        }
    }

    const ToggleTranslation = async () => {
        if (userData?.translationDisclaimerSeen) {
            setIsTranslation();
        } else {
            toast.custom((t) => (
                <div
                    className="max-w-md relative w-full rounded-xl border border-[#38BBAD]/20 bg-linear-to-br from-[#1a1a1a] via-[#131313] to-[#020403] p-4 shadow-lg shadow-[#38BBAD]/5"
                >
                    <div className="flex items-start gap-3">
                        <div className="text-sm text-[#38BBAD] border rounded-full flex items-center justify-center size-5 border-[#38BBAD]">
                            !
                        </div>
                        <div className='flex-1'>
                            <h3 className="text-sm font-medium text-[#38BBAD]">
                                Translation Note
                            </h3>

                            <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                                Messages are translated via a third-party service. For your privacy, please avoid sharing sensitive info
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className=" text-neutral-500 hover:text-neutral-300 text-xs p-0.5 absolute top-2 right-3 cursor-pointer"
                        aria-label="Close notification"
                    >
                        ✕
                    </button>
                </div>
            ), {
                duration: 10000,
                position: "top-center"
            })

            const res = await markDeclaimerSeen()
            if (res.message) {
                if (!res.success) toast.error(res.message)
            }
            setIsTranslation()
        }
    }

    if (isAuthChecking) return <PageLoader />
    return (
        <div className="flex flex-row relative p-4 xs:p-5 gap-3.5 xs:gap-5 bg-linear-to-br from-[#1a1a1a] via-[#131313] to-[#020403] w-screen h-screen min-h-120">
            {isShowMedia &&
                <div className="absolute flex justify-center items-center top-0 left-0 z-50 h-screen min-h-120 w-screen backdrop-blur-xs">
                    <div
                        ref={mediaRef}
                        className="w-5/6 sm:w-150 lg:w-200 h-1/2 sm:h-100 lg:h-120 xl:h-150 ">
                        <MediaList />
                    </div>
                </div>
            }
            <div className="py-0 xsm:py-4 w-6 xsm:w-8 flex flex-col justify-between items-center gap-5 z-40">
                <div className="flex flex-col items-center gap-4 xsm:gap-5">
                    <button
                        onClick={() => {
                            setActiveTab("chats")
                            setIsSidebarOpen(true)
                        }}
                        className={`tooltip tooltip-info tooltip-right before:bg-[#38BBAD] before:translate-x-1 before:font-sans before:font-bold after:translate-x-1 after:bg-[#38BBAD] transition-all duration-200 p-2 cursor-pointer ${activeTab === "chats" ? "bg-white/15" : "hover:bg-white/15"} rounded-lg`} data-tip="Chats">
                        <MessageCircle className='size-5 xsm:size-6 text-[#38BBAD]' />
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("search")
                            setIsSidebarOpen(true)
                        }}
                        className={`tooltip tooltip-info tooltip-right before:bg-[#38BBAD] before:translate-x-1 before:font-sans before:font-bold after:translate-x-1 after:bg-[#38BBAD] transition-all duration-200 p-2 cursor-pointer ${activeTab === "search" ? "bg-white/15" : "hover:bg-white/15"} rounded-lg`} data-tip="Search">
                        <Search className='size-5 xsm:size-6 text-[#38BBAD]' />
                    </button>
                    <button
                        onClick={() => {
                            setShowMedia(true)
                            setIsSidebarOpen(false)
                        }}
                        className={`tooltip tooltip-info tooltip-right before:bg-[#38BBAD] before:translate-x-1 before:font-sans before:font-bold after:translate-x-1 after:bg-[#38BBAD] transition-all duration-200 p-2 cursor-pointer ${isShowMedia ? "bg-white/15" : "hover:bg-white/15"} rounded-lg`} data-tip="Media">
                        <Images className='size-5 xsm:size-6 text-[#38BBAD]' />
                    </button>
                </div>
                <div className="flex flex-col items-center gap-5 ">
                    <button
                        onClick={() => {
                            Logout()
                            setIsSidebarOpen(false)
                            setActiveTab(null)
                        }}
                        className={`tooltip tooltip-info tooltip-right before:bg-[#38BBAD] before:translate-x-1 before:font-sans before:font-bold after:translate-x-1 after:bg-[#38BBAD] transition-all duration-200 p-2 cursor-pointer hover:bg-white/15 rounded-lg`} data-tip="Log out">
                        <LogOut className='size-5 xsm:size-6 text-[#38BBAD]' />
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("user");
                            setIsSidebarOpen(true);
                        }}
                        className={`tooltip tooltip-info tooltip-right before:bg-[#38BBAD] before:translate-x-1 before:font-sans before:font-bold after:translate-x-1 after:bg-[#38BBAD] transition-all duration-200 p-2 cursor-pointer ${activeTab === "user" ? "bg-white/15" : "hover:bg-white/15"} rounded-lg`} data-tip="Profile">
                        {userData?.ProfilePic === "" ?
                            <CircleUser className='size-5 xsm:size-6 text-[#38BBAD]' />
                            : <div className="size-6 xsm:size-7 border border-[#38BBAD] rounded-full overflow-hidden">
                                <img src={userData?.ProfilePic} alt="Prfile photo" className="object-cover size-full" />
                            </div>

                        }
                    </button>
                </div>
            </div>
            <div
                ref={sidebarRef}
                className={`
                            xsm:absolute lg:relative flex flex-col gap-3 xsm:gap-5 px-4 xsm:px-6 py-3 xsm:py-4 overflow-auto 
                            xsm:ml-13 lg:ml-0 inset-4.5 lg:inset-0 flex-1 xsm:flex-none xsm:w-76 xl:w-96 
                            bg-linear-to-br from-[#22262b] to-[#12171b] lg:from-gray-700/30 lg:to-gray-800/30 border border-gray-400/40 lg:border-white/10 rounded-2xl 
                            z-30 shadow-[0_35px_35px_rgba(0,0,5,0.5)] lg:shadow-none 
                            transition-all duration-400 ease-in-out
                            lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto 
                            ${isSidebarOpen
                        ? "translate-x-0 opacity-100 pointer-events-auto"
                        : "xsm:-translate-x-[120%] xsm:opacity-0 "}`}>
                {activeTab === "user" ?
                    <UserSetting />
                    :
                    <>
                        <span className="uppercase font-bold text-xl xsm:text-3xl text-white">inlango</span>
                        {activeTab === "chats" && <ChatList />}
                        {activeTab === "search" && <UsersList />}
                    </>
                }
            </div>
            <div
                className={`flex-1 flex min-h-0 absolute xsm:relative z-60 xsm:z-0 ${activeChatPartner ? "flex" : "hidden xsm:block"}  flex-col border border-white/10 bg-linear-to-br xsm:bg-linear-to-b from-[#22262b] to-[#12171b] lg:from-gray-700/30 inset-2.5 xsm:inset-0 xsm:from-gray-700/30 xsm:to-gray-900/30 rounded-2xl gap-2`}>
                {activeChatPartner ?
                    <div className='h-full flex flex-col p-2.5 xs:p-4'>
                        <div className="h-13 xs:h-15 xsm:h-18 bg-linear-to-r from-gray-600/30 to-gray-700/30 border-white/15 border rounded-2xl flex items-center justify-between gap-5 px-2 xs:px-3.5 xsm:px-5">
                            <div className="flex items-center gap-2.5 xsm:gap-5">
                                <div
                                    onClick={() => {
                                        setActiveChatPartner(null)
                                        setIsSidebarOpen(true)
                                    }}
                                    className="xsm:hidden hover:bg-white/10 rounded-full transition-all duration-200 p-0.5">
                                    <ArrowLeft className='size-4.5 xs:size-6' />
                                </div>
                                <div className="size-7 xs:size-8 xsm:size-11 overflow-hidden rounded-full avatar">
                                    {activeChatPartner.ProfilePic === "" ?
                                        <CircleUser className="size-full stroke-1" /> :
                                        <img src={activeChatPartner.ProfilePic} alt="PFP" className="size-full" />
                                    }
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="block max-w-16 xs:max-w-30 sm:max-w-40 md:max-w-60 text-xs xs:text-sm xsm:text-base sm:text-lg font-semibold tracking-widest font-dosis truncate">
                                        {activeChatPartner.Username}
                                    </span>
                                    <div className="flex gap-1.5 xsm:gap-2 items-center text text-[10px] xsm:text-xs">
                                        <div className={`size-1.5 xs:size-2 rounded-full ${onlineUser.includes(activeChatPartner._id) ? "bg-green-400" : "bg-gray-400/70"}`}></div>
                                        <span className={` ${onlineUser.includes(activeChatPartner._id) ? "text-white/80" : "text-white/50"}`}>{onlineUser.includes(activeChatPartner._id) ? "Online" : "Offline"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-2.5 xsm:gap-3 sm:gap-4">
                                <span className="text-xs xsm:text-sm sm:text-base">Translation </span>
                                <input type="checkbox" onChange={() => ToggleTranslation()} className="toggle checked:text-[#38BBAD] h-4.5 w-7 sm:h-6 sm:w-10" />
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 flex flex-col justify-between">
                            <div className="flex-1 min-h-0 overflow-y-auto py-4">
                                <MessagesList />
                            </div>
                            <SendingMessage />
                        </div>
                    </div> :
                    <NoActiveChat />
                }
            </div>
        </div >
    )
}