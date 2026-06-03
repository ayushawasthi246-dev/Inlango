
export default function noActiveChat() {
    return (
        <>
            <div className="h-full w-full flex flex-col gap-3 sm:gap-5 items-center justify-center">
                <div className="relative h-44 sm:h-56 left-5">
                    <div className="absolute messageFloatUp flex flex-col gap-5 justify-center p-5 h-24 sm:h-32 w-40 sm:w-64 shadow-[0_0_20px_5px_rgba(25,78,74,0.5)] border border-[#2f978c]/20 rounded-2xl bg-[#242525]">
                        <div className="h-1 sm:h-3 rounded-full w-16 sm:w-24 bg-[#2f978c]"></div>
                        <div className="h-1 sm:h-3 rounded-full w-28 sm:w-48 bg-[#28504c]"></div>
                    </div>
                    <div className="flex messageFloatDown flex-col gap-5 justify-center p-5 h-24 sm:h-32 w-40 sm:w-64 shadow-[0_0_20px_5px_rgba(25,78,74,0.5)] border border-[#2f978c]/20 rounded-2xl -translate-x-12 translate-y-16 bg-[#242525]">
                        <div className="h-1 sm:h-3 rounded-full w-16 sm:w-24 bg-[#2f978c]"></div>
                        <div className="h-1 sm:h-3 rounded-full w-28 sm:w-48 bg-[#28504c]"></div>
                    </div>
                </div>
                <span className="text-xl sm:text-3xl font-Padauk tracking-wide">It's nice to chat with someone</span>
                <span className="text-sm sm:text-base text-white/40 text-center">pick a person from left menu <br/> and start your conversation</span>
            </div>
        </>
    )
}