import assets from "../assets/assets.tsx" 
export default function homepage(){
    return(
        <div className="flex flex-col bg-linear-to-br from-[#1a1a1a] via-[#131313] to-[#020403] w-screen h-screen">
            <nav className="flex justify-between py-5 px-14">
                <div className="flex gap-2 items-center">
                    <img className="size-16" src={assets.logo} alt="logo" />
                    <span className="uppercase font-bold text-2xl text-white">inlango</span>
                </div>
                <div className="flex gap-6 items-center">
                    <button className="text-[#38BBAD] uppercase font-bold tracking-widest cursor-pointer hover:scale-105 transition-all duration-200 border-2 px-6 py-2 rounded-full ">Log in</button>
                    <button className="text-[#38BBAD] uppercase font-bold tracking-widest cursor-pointer hover:scale-105 transition-all duration-200 border-2 px-6 py-2 rounded-full ">Sing up</button>
                </div>
            </nav>
            <div className="flex-1 flex flex-col gap-14 justify-center">
                <div className="flex flex-col gap-3 justify-center items-center">
                    <div className="text-white flex gap-4 uppercase text-5xl font-bold tracking-wide">
                        <span className="">You type in your</span>
                        <span className="text-[#38BBAD]">language</span>
                        </div>
                    <span className="text-white uppercase text-5xl font-bold tracking-wide">They read in theirs — </span>
                    <span className="text-white/60 uppercase text-xl font-bold tracking-wide">seamlessly, instantly, and without barriers</span>
                </div>
                <div className="flex flex-col gap-5 items-center">
                    <div className="flex gap-4 justify-center">
                        <button className="text-lg font-extrabold text-black bg-[#38BBAD] px-8 py-2 rounded-full font-roboto-mono cursor-pointer transition-all duration-200 hover:scale-105">Create Account</button>
                        <button className="bg-white flex items-center gap-3 px-8 py-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-105">
                            <img className="size-6" src={assets.google} alt="" />
                            <span className="text-lg font-extrabold text-black font-roboto-mono">Sign up with Google</span>
                        </button>
                    </div>
                    <span className="text-white/50 text-lg">You’re one step away from barrier-free conversations</span>
                </div>
                <img src={assets.telugu} className="float absolute size-14 top-50 right-60" />
                <img src={assets.korean} className="float absolute size-14 bottom-70 right-20" />
                <img src={assets.englsih} className="float absolute size-14 bottom-45 right-70" />
                <img src={assets.hindi} className="float absolute size-14 top-65 left-35" />
                <img src={assets.japanese} className="float absolute size-14 bottom-70 left-75" />
                <img src={assets.chinese} className="float absolute size-14 bottom-35 left-25" />
            </div>
        </div>
    )
}