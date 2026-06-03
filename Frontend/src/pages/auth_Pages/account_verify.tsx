import assets from "../../assets/assets.tsx"
import { authStore } from "../../store/userAuthStore.tsx";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react"
import { useNavigate, useParams } from 'react-router-dom'
import PageLoader from "../../components/pageLoader.tsx";
import toast from "react-hot-toast";

export default function verifyAccount() {

    const navigate = useNavigate()

    const { token } = useParams()

    const { isAuthChecking, checkAuth, otpSubmit, resendOTP } = authStore()

    useEffect(() => {
        const checkingAuth = async () => {
            const res = await checkAuth()
            if (res.success) {
                if(res.message) toast.success(res.message)
                navigate("/message")
            }else{
                if(res.message) toast.error(res.message)
            }
        }
        checkingAuth()
    }, [checkAuth, navigate])

    const length = 6
    const [otp, setotp] = useState<string[]>(Array(length).fill(""))
    const inputref = useRef<(HTMLInputElement | null)[]>([])

    const otpSubmission = async () => {

        const combinedOTP = otp.join("");

        if (combinedOTP.length !== length) {
            toast.error("Please enter the full code");
            return;
        }
        if (token) {
            const res = await otpSubmit(token, combinedOTP)
            if (res.success) {
                if(res.message) toast.success(res.message)
                navigate("/message")
            }else{
                if(res.message) toast.error(res.message)
            }
        }
    }

    const handleinput = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp]
        newOtp[index] = value
        setotp(newOtp)

        if (value && index < length - 1) {
            inputref.current[index + 1]?.focus()
        }
    }

    const handlekeydown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && index > 0) {
            otp[index] = ""
            inputref.current[index - 1]?.focus()
        }
        const newOtp = [...otp]
        if (e.key === "Enter" && newOtp.every((digit) => digit != "")) {
            otpSubmission()
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault()

        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
        const newOtp = pastedData.split("")

        const updatedOtp = [...otp]
        newOtp.forEach((value, idx) => {
            if (!inputref.current[idx]!.value) {
                updatedOtp[idx] = value
                inputref.current[idx]!.value = value
            }
        })

        setotp(updatedOtp)

        const nextIndex = Math.min(newOtp.length, length - 1)
        inputref.current[nextIndex]?.focus()
    }

    const resendingOTP = async () => {
        if (token){
            const res = await resendOTP(token)
            if (res.success) {
                if(res.message) toast.success(res.message)
            }else{
                if(res.message) toast.error(res.message)
            }
        } 
    }

    if (isAuthChecking) return <PageLoader />

    return (
        <div className="flex justify-center items-center bg-linear-to-br from-[#1a1a1a] via-[#131313] to-[#020403] w-screen h-screen min-h-90 xsm:min-h-100">
            <div className="w-72 xs:w-80 xsm:w-100 flex flex-col gap-8 items-center ">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-center items-center gap-4">
                        <img className="size-10 xsm:size-12" src={assets.logo} alt="logo" />
                        <span className="uppercase font-bold text-xl xsm:text-2xl text-white">inlango</span>
                    </div>
                    <span className="text-[10px] xs:text-sm font-bold font-sans tracking-widest text-white/70 text-center">Enter the verification code to verify your account</span>
                </div>
                <div onPaste={handlePaste} className="w-72 xs:w-80 xsm:w-100 flex justify-between ">
                    {otp.map((digit, index) => (
                        <input
                            type="text"
                            inputMode='numeric'
                            pattern="[0-9]*"
                            maxLength={1}
                            required
                            key={index}
                            value={digit}
                            className={`size-10 xsm:size-12 text-center text-lg rounded-lg xsm:rounded-2xl outline-none border border-white/40 text-white focus:border-[#38BBAD]/40 focus:shadow-[0_0_10px_#38BBAD] ${digit ? "border-[#38BBAD] shadow-[0_0_10px_#38BBAD]" : ""}`}
                            ref={(el) => { inputref.current[index] = el }}
                            onChange={(e) => handleinput(e.target.value, index)}
                            onKeyDown={(e) => handlekeydown(e, index)}
                        />
                    ))}
                </div>
                <div className="flex w-72 xs:w-80 xsm:w-100 gap-3">
                    <span className="text-xs xsm:text-sm">Didn’t receive a code?</span>
                    <div className="flex items-center gap-1 xsm:gap-2 cursor-pointer group">
                        <span onClick={resendingOTP} className="text-[#38BBAD] text-xs xsm:text-sm font-semibold group-hover:text-[#60ccc1] transition-all duration-200">Resend</span>
                        <ArrowRight className="size-3 xsm:size-4 translate-y-0.5 xsm:translate-y-0 text-[#38BBAD] group-hover:text-[#60ccc1] transition-all duration-200" />
                    </div>
                </div>

                <button
                    onClick={otpSubmission}
                    type="submit"
                    className="flex justify-center items-center gap-2 group w-full mt-2 py-1 sm:py-2 rounded-full text-black font-Padauk font-bold text-base sm:text-lg bg-[#46b4a9] cursor-pointer hover:bg-[#1fad9f] transition-all duration-300">
                    <span className="">Verify</span>
                    <ArrowRight className="size-3.5 xsm:size-4.5 group-hover:translate-x-1 transition-all duration-200 " />
                </button>

            </div>
        </div>
    )
}