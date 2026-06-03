import assets from "../assets/assets";

export default function noMessages() {
    return (
        <>
            <div className="h-full w-full flex flex-col gap-2 xs:gap-3.5 `xsm:gap-5 items-center justify-center">
                <img src={assets.No_Message} alt="" className="h-40 xsm:h-50" />
                <span className="text-lg xs:text-xl xsm:text-3xl font-Padauk">No Messages</span>
                <span className="text-xs xs:text-sm xsm:text-lg text-white/50 text-center">When you have messages <br/>you'll see them here</span>
            </div>
        </>
    )
}