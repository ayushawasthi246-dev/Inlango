import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { useScroll, useTransform, useMotionValueEvent } from "motion/react"
import { useGoogleLogin } from "@react-oauth/google"
import assets from "../assets/assets.tsx"
import toast from "react-hot-toast"
import { authStore } from "../store/userAuthStore.tsx"
import { CircleCheck, Globe, Languages, Lock, MessageSquareDot, SendHorizontal, Sparkles, ToggleRight } from "lucide-react"
import { useEffect, useState } from "react"

export default function homepage() {
    const navigate = useNavigate()
    const { loginWithGoogle } = authStore()
    const { scrollY } = useScroll()

    const [isScrolled, setIsScrolled] = useState(false)


    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 0);
    })

    const y = useTransform(scrollY, [0, 200], [-80, 0])
    const scale = useTransform(scrollY, [0, 200], [0.8, 1])

    function useIsMd() {

        const [isMd, setIsMd] = useState(() => {
            if (typeof window !== "undefined") {
                return window.innerWidth >= 768;
            }
            return false;
        });

        useEffect(() => {
            const check = () => setIsMd(window.innerWidth >= 768);
            window.addEventListener("resize", check);
            return () => window.removeEventListener("resize", check);
        }, []);

        return isMd;
    }

    function useIsSm() {

        const [isSm, setIsSm] = useState(() => {
            if (typeof window !== "undefined") {
                return window.innerWidth >= 640;
            }
            return false;
        });

        useEffect(() => {
            const check = () => setIsSm(window.innerWidth >= 640);
            window.addEventListener("resize", check);
            return () => window.removeEventListener("resize", check);
        }, []);

        return isSm;
    }

    const isMd = useIsMd();
    const isSm = useIsSm();

    const handleSuccess = async (authResult: any) => {
        const res = await loginWithGoogle(authResult)
        if (res.success) {
            navigate("/message")
            if (res.message) toast.success(res.message)
        } else {
            if (res.message) toast.error(res.message)
        }
    }
    const handleError = () => {
        toast.error("Google sign-in failed")
    }
    const googleLogin = useGoogleLogin({
        onSuccess: handleSuccess,
        onError: handleError,
        flow: 'auth-code',
        scope: 'email profile',
    })

    return (
        <div className="bg-[#131313] text-[#e5e2e1] font-sans antialiased overflow-x-hidden min-h-screen">

            <nav className={`fixed top-0 w-full z-50 ${isScrolled ? "bg-[#131313]/70 border-b border-white/10 backdrop-blur-lg " : ""} `}>
                <div className="max-w-300 mx-auto px-6 xsm:px-10 sm:px-16 lg:px-6 flex justify-between items-center h-20">
                    <div className="flex items-center gap-2.5 sm:gap-4">
                        <img className="size-7 md:size-11" src={assets.logo} alt="logo" />
                        <span className="text-base xsm:text-xl md:text-2xl font-bold text-[#e5e2e1] tracking-tight">INLANGO</span>
                    </div>
                    <div className="flex gap-4 sm:gap-6 items-center">
                        <button onClick={() => navigate("/login")} className="text-[#38BBAD] uppercase text-[10px] xsm:text-xs sm:text-sm font-semibold tracking-widest cursor-pointer hover:font-bold hover:scale-105 transition-all duration-200 py-2">Log in</button>
                        <button onClick={() => navigate("/registration")} className="text-[#38BBAD] text-[10px] xsm:text-xs sm:text-sm uppercase font-bold tracking-widest cursor-pointer hover:scale-105 transition-all duration-200 border-2 px-3.5 xsm:px-4.5 sm:px-6 py-2 rounded-full ">Sing up</button>
                    </div>
                </div>
            </nav>

            <main className="">

                <section className="relative max-h-screen md:min-h-200 pt-28 xsm:pt-36 pb-20 md:py-32 overflow-hidden bg-[radial-gradient(circle_at_top_center,#1a2e2c_0%,#101313_100%)]">
                    <div className="max-w-300 mx-auto px-4 xs:px-6 relative z-10 flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-1.5 xs:gap-2 px-2.5 xs:px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 mb-8">
                            <Sparkles className="text-[#5edacb] size-3 xsm:size-4 lg:size-5" />
                            <span className="text-[8px] xs:text-[10px] xsm:text-xs lg:text-sm font-medium text-[#bcc9c6]">Every message uses AI-powered context-aware translation</span>
                        </div>

                        <h1 className="text-2xl xsm:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-4xl mb-6 text-[#e5e2e1] leading-tight tracking-tight">
                            The modern chat app that <br className="hidden xs:block" />
                            removes
                            <motion.span
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                                viewport={{ once: true }}
                                className="bg-linear-to-r ml-3 from-[#5edacb] to-[#38bbad] bg-clip-text text-transparent">
                                every language</motion.span> barrier
                        </h1>

                        <p className="text-[10px] xsm:text-sm sm:text-base md:text-lg lg:text-xl text-[#bcc9c6] px-6 max-w-2xl mb-8 xsm:mb-12 leading-relaxed">
                            You write in your language. They read it in theirs. Real-time translation built into the chat — no copy-pasting, no extra apps, no awkward pauses.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <button onClick={() => navigate("/registration")} className="text-xs xsm:text-base sm:text-lg font-extrabold text-black bg-[#38BBAD] px-4 xsm:px-6 sm:px-8 py-2 rounded-full font-roboto-mono cursor-pointer transition-all duration-200 hover:scale-105">Create Account</button>
                            <button onClick={googleLogin} className="bg-white flex items-center gap-3 px-4 xsm:px-6 sm:px-8 py-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-105">
                                <img className="size-3 xsm:size-4.5 sm:size-6" src={assets.google} alt="" />
                                <span className="text-xs xsm:text-base sm:text-lg font-extrabold text-black font-roboto-mono">Sign up with Google</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-8 sm:gap-16 mt-3 text-sm font-medium text-[#bcc9c6]/70">
                            <span className="flex text-xs xsm:text-base items-center gap-2"><CircleCheck className="size-3.5 xsm:size-4.5" /> Free</span>
                            <span className="flex  text-xs xsm:text-base items-center gap-2"><Globe className="size-3.5 xsm:size-4.5" /> 200+ languages</span>
                            <span className="flex  text-xs xsm:text-base items-center gap-1"><Lock className="size-3.5 xsm:size-4.5" /> Secure Auth</span>
                        </div>
                    </div>
                </section>

                <motion.section
                    style={isSm ? { y, scale } : {}}
                    className="max-w-200 lg:max-w-300 mx-4 sm:mx-10 md:mx-auto xs:px-6 md:-mt-16 relative z-20 mb-18 xsm:mb-24">
                    <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-md border border-white/10 p-2 xsm:p-4">
                        <div className="bg-[#1c1b1b] rounded-2xl p-3.5 xsm:p-5 sm:p-8 flex flex-col md:flex-row gap-5 xsm:gap-12 items-center min-h-125">

                            <div className="w-full md:w-1/2 flex justify-center">
                                <img src={assets.Phone_Demo} alt="Demo" className="max-h-90 xsm:max-h-110 sm:max-h-125 lg:max-h-150" />
                            </div>


                            <motion.div
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="w-full md:w-1/2 flex flex-col gap-4 lg:gap-6 text-left">
                                <div className="inline-flex items-center gap-3 px-4 py-1.5 xsm:py-2 bg-[#5edacb]/10 rounded-xl border border-[#5edacb]/20 self-start">
                                    <Languages className="text-[#5edacb] size-3 xsm:size-4 lg:size-5" />
                                    <p className="text-[10px] xsm:text-xs lg:text-sm font-medium text-[#5edacb]">Translation Active</p>
                                </div>
                                <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-[#e5e2e1]">Chat Without Language Barriers</h2>
                                <p className="text-[10px] xsm:text-xs sm:text-sm lg:text-base text-[#bcc9c6] leading-relaxed">
                                    Send a message in your language. The other side receives it in theirs, translated instantly in real time with context-aware AI.
                                </p>
                                <div className="flex flex-col mt-5 gap-5">
                                    <div className="flex items-start gap-5">
                                        <div className="min-h-10 min-w-10 rounded-lg bg-[#353534] flex items-center justify-center">
                                            <img src={assets.Gemini_icon} alt="" className="size-4.5 lg:size-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs xsm:text-sm lg:text-base text-[#e5e2e1]">Parallel Gemini AI</p>
                                            <p className="text-[10px] xsm:text-xs lg:text-sm text-[#bcc9c6]">Runs multiple Gemini models in parallel for faster, more reliable translation.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="min-h-10 min-w-10 rounded-lg bg-[#353534] flex items-center justify-center">
                                            <MessageSquareDot className="text-[#5edacb] size-4.5 lg:size-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs xsm:text-sm lg:text-base text-[#e5e2e1]">Slang Friendly</p>
                                            <p className="text-[10px] xsm:text-xs lg:text-sm text-[#bcc9c6]">Preserves meaning across tone, slang, and real conversations</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                <section className="bg-[#0e0e0e] py-14 lg:py-24 mb-20 border-y border-white/10">
                    <div className="max-w-300 mx-auto px-4 xs:px-10 sm:px-14 lg:px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">

                            <motion.div
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="flex flex-col gap-7 sm:gap-10 p-6 sm:p-8 bg-[#0e0e0e] rounded-3xl border border-white/20">
                                <div className="bg-[#353534]/50 flex flex-col gap-2.5 border-r-2 border-[#6d6d6c] hover:shadow-[0_0_10px_#6d6d6c] hover:scale-102 transition-all duration-250 rounded-2xl p-4 max-w-[85%]">
                                    <p className="text-[#e5e2e1] text-xs xs:text-sm sm:text-base">こんにちは、明日のミーティングの時間を変更できますか？</p>
                                    <div className="h-0.5 w-full bg-white/10 my-3"></div>
                                    <p className="text-[#e5e2e1] text-xs xs:text-sm sm:text-base">Hi, is it possible to change the time of tomorrow's meeting?</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-[10px] text-[#bcc9c6]">10:42 AM</span>
                                        <span className="text-[10px] text-[#5edacb]/80">Hide Translation</span>
                                    </div>
                                </div>

                                <div className="bg-[#5edacb]/10 flex flex-col gap-2.5 border-l-2 border-[#5edacb] hover:shadow-[0_0_10px_#5edacb70] hover:scale-102 transition-all duration-250 rounded-2xl p-4 ml-6 shadow-lg ">
                                    <p className="text-[#e5e2e1] text-xs xs:text-sm sm:text-base font-medium">Yes, we can reschedule. What time works for you?</p>
                                    <div className="h-0.5 w-full bg-white/10 my-3"></div>
                                    <p className="text-[#e5e2e1] text-xs xs:text-sm sm:text-base ">はい、日程変更可能です。ご都合の良い時間帯をお知らせください。</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-[10px] text-[#bcc9c6]">10:43 AM</span>
                                        <span className="text-[10px] text-[#5edacb]/80">Hide Translation</span>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="flex flex-col gap-7 sm:gap-10">
                                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#e5e2e1]">How It Works</h2>
                                <div className="space-y-8">

                                    <div className="flex gap-6">
                                        <div className="shrink-0 size-11 sm:size-12 bg-[#5edacb]/10 rounded-xl flex items-center justify-center border border-[#5edacb]/20">
                                            <Languages className="text-[#5edacb] size-5 sm:size-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm sm:text-base lg:text-lg text-[#e5e2e1] mb-2">Language Selection</h3>
                                            <p className="text-xs sm:text-sm lg:rtext-base text-[#bcc9c6] leading-relaxed">The user selects their preferred input language before starting the conversation</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="shrink-0 size-11 sm:size-12 bg-[#5edacb]/10 rounded-xl flex items-center justify-center border border-[#5edacb]/20">
                                            <ToggleRight className="text-[#5edacb] size-5 sm:size-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm sm:text-base lg:text-lg text-[#e5e2e1] mb-2">Live Toggle Control</h3>
                                            <p className="text-xs sm:text-sm lg:rtext-base text-[#bcc9c6] leading-relaxed">Users can enable or disable translation at any time, allowing them to switch between sending raw and translated messages.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="shrink-0 size-11 sm:size-12 bg-[#5edacb]/10 rounded-xl flex items-center justify-center border border-[#5edacb]/20">
                                            <img src={assets.Gemini_icon} alt="" className="size-5 sm:size-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm sm:text-base lg:text-lg text-[#e5e2e1] mb-2">Gemini-Powered Translation Layer</h3>
                                            <p className="text-xs sm:text-sm lg:rtext-base  text-[#bcc9c6] leading-relaxed">Processed by Gemini for contextual, semantic translation (not word-for-word)</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="shrink-0 size-11 sm:size-12 bg-[#5edacb]/10 rounded-xl flex items-center justify-center border border-[#5edacb]/20">
                                            <SendHorizontal className="text-[#5edacb] size-5 sm:size-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm sm:text-base lg:text-lg text-[#e5e2e1] mb-2">Real-Time Delivery via WebSocket</h3>
                                            <p className="text-xs sm:text-sm lg:rtext-base text-[#bcc9c6] leading-relaxed">Messages are delivered instantly via WebSocket after translation</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-300 mx-auto px-8 sm:px-12 lg:px-6 mb-20" id="features">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8">

                        <motion.div
                            initial={{ opacity: 0, x: isMd ? -80 : -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group hover:scale-103 transition-all duration-300 md:col-span-7 relative rounded-3xl p-0.5 overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                                <div className="absolute inset-[-200%] animate-flow bg-[conic-gradient(from_0deg,#5edacb,#00fff0,#5edacb,transparent)] blur-xl" />
                            </div>
                            <div className="relative h-full bg-[#1c1b1b] group-hover:bg-[#222222] rounded-3xl p-6 lg:p-10 flex flex-col gap-4 sm:gap-5">
                                <div className="px-3 w-fit py-1 bg-[#5edacb]/10 text-[#5edacb] rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    The Security & Auth
                                </div>
                                <h3 className="text-lg sm:text-xl lg:text-3xl font-bold text-[#e5e2e1]">
                                    Production-Grade Auth
                                </h3>
                                <p className="text-xs sm:text-sm lg:text-base text-[#bcc9c6]">
                                    Implemented a secure authentication pipeline using rotating Access & Refresh Tokens to keep user sessions secure and persistent without compromising performance
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: isMd ? 80 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group hover:scale-103 transition-all duration-300 md:col-span-5 relative rounded-3xl p-0.5 overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                                <div className="absolute inset-[-200%] animate-flow bg-[conic-gradient(from_0deg,#5edacb,#00fff0,#5edacb,transparent)] blur-xl" />
                            </div>
                            <div className="relative h-full bg-[#1c1b1b] group-hover:bg-[#222222] rounded-3xl p-6 lg:p-10 flex flex-col gap-4 sm:gap-5">
                                <div className="px-3 w-fit py-1 bg-[#5edacb]/10 text-[#5edacb] rounded-full text-[10px] font-bold uppercase tracking-wider">The Shield</div>
                                <h3 className="text-lg sm:text-xl lg:text-3xl font-bold text-[#e5e2e1]">Intelligent Rate Limiting</h3>
                                <p className="text-xs sm:text-sm lg:text-base text-[#bcc9c6]">
                                    Integrated Arcjet to shield the translation API and WebSockets from abuse. Protects application resources against DDoS vectors and spam bots automatically
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: isMd ? -80 : -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group hover:scale-103 transition-all duration-300 md:col-span-5 relative rounded-3xl p-0.5 overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                                <div className="absolute inset-[-200%] animate-flow bg-[conic-gradient(from_0deg,#5edacb,#00fff0,#5edacb,transparent)] blur-xl" />
                            </div>
                            <div className="relative h-full bg-[#1c1b1b] group-hover:bg-[#222222] rounded-3xl p-6 lg:p-10 flex flex-col gap-4 sm:gap-5">
                                <div className="px-3 w-fit py-1 bg-[#5edacb]/10 text-[#5edacb] rounded-full text-[10px] font-bold uppercase tracking-wider">The Media</div>
                                <h3 className="text-lg sm:text-xl lg:text-3xl font-bold text-[#e5e2e1]">Instant Media Sharing</h3>
                                <p className="text-xs sm:text-sm lg:text-base text-[#bcc9c6]">
                                    Seamlessly send and receive images mid-chat. Powered by Cloudinary for lightning-fast asset optimization, secure storage, and instantaneous delivery
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: isMd ? 80 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group hover:scale-103 transition-all duration-300 md:col-span-7 relative rounded-3xl p-0.5 overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                                <div className="absolute inset-[-200%] animate-flow bg-[conic-gradient(from_0deg,#5edacb,#00fff0,#5edacb,transparent)] blur-xl" />
                            </div>
                            <div className="relative h-full bg-[#1c1b1b] group-hover:bg-[#222222] rounded-3xl p-6 lg:p-10 flex flex-col gap-4 sm:gap-5">
                                <div className="px-3 w-fit py-1 bg-[#5edacb]/10 text-[#5edacb] rounded-full text-[10px] font-bold uppercase tracking-wider">The Global Reach</div>
                                <h3 className="text-lg sm:text-xl lg:text-3xl font-bold text-[#e5e2e1]">200+ Languages Supported</h3>
                                <p className="text-xs sm:text-sm lg:text-base text-[#bcc9c6]">
                                    From globally spoken languages to localized dialects, the AI layer fluidly interprets expressions across hundreds of languages. No matter where the other person is from, you can converse naturally in your native tongue.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

            </main>
            <footer className="bg-[#1c1b1b] border-t border-white/10">
                <div className="max-w-300 mx-auto px-10 sm:px-16 lg:px-6 py-7 sm:py-10">
                    <div className="flex justify-between items-start gap-10 lg:gap-12 mb-5 sm:mb-10">
                        <div className="max-w-60 sm:max-w-85 lg:max-w-100">
                            <div className="flex items-center gap-3.5 lg:gap-5 mb-2.5 xsm:mb-4">
                                <img className="size-8 sm:size-10 lg:size-13" src={assets.logo} alt="logo" />
                                <span className="text-lg sm:text-xl lg:text-3xl uppercase font-bold text-[#e5e2e1]">Inlango</span>
                            </div>
                            <p className="text-[10px] xsm:text-xs lg:text-sm text-[#bcc9c6] leading-relaxed">
                                The instant messaging app with built-in real-time translation. Chat naturally with anyone, in any language.
                            </p>
                        </div>

                        <div className="flex flex-col items-center xsm:items-start mt-2">
                            <h4 className="font-bold text-[10px] xsm:text-sm lg:text-base text-[#e5e2e1] mb-3 xsm:mb-4 lg:mb-6 uppercase tracking-widest opacity-70">Connect</h4>
                            <ul className="space-y-4 lg:space-y-6">
                                <li className="">
                                    <a href="https://github.com/ayushawasthi246-dev" className="text-[#bcc9c6] text-[10px] sm:text-xs lg:text-base hover:text-[#5edacb] transition-colors flex items-center gap-3 sm:gap-5 cursor-pointer" >
                                        <img src={assets.Github} alt="Github" className="size-3.5 sm:size-4.5 lg:size-6.5" />
                                        <span className="hidden xsm:block">Github</span>
                                    </a>
                                </li>
                                <li className="">
                                    <a href="https://www.linkedin.com/in/ayush-awasthi-0a264b36a/" className="text-[#bcc9c6] text-[10px] sm:text-xs lg:text-base hover:text-[#5edacb] transition-colors flex items-center gap-3 sm:gap-5 cursor-pointer" >
                                        <img src={assets.Linked_in} alt="Linked in" className="size-3.5 sm:size-4.5 lg:size-6.5" />
                                        <span className="hidden xsm:block">Linked in</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <p className="text-[10px] sm:text-sm text-center pt-5 sm:pt-10 border-t border-white/5 text-[#bcc9c6]">@ 2026 ayush awasthi . all rights reserved</p>
                </div>
            </footer>

        </div>
    );
}