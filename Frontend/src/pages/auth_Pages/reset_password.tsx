import assets from "../../assets/assets.tsx"
import { authStore } from "../../store/userAuthStore.tsx";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react"
import { useNavigate, useParams } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PageLoader from "../../components/pageLoader.tsx";


export default function resetPassword() {

    const navigate = useNavigate()

    const { token } = useParams()

    const { isAuthChecking, checkAuth, passReset } = authStore()

    useEffect(() => {
        const checkingAuth = async () => {
            const res = await checkAuth()
            if (res.success) {
                if (res.message) toast.success(res.message)
                navigate("/message")
            } else {
                if (res.message) toast.error(res.message)
            }
        }
        checkingAuth()
    }, [checkAuth, navigate])

    const [passEye, setpassEye] = useState<boolean>(true)

    type resetPassword = {
        Password: string
    }
    const {
        register,
        handleSubmit,
    } = useForm<resetPassword>();


    const onSubmit = async (newPass: resetPassword) => {
        if (!token) {
            toast.error("Invalid reset link. Please request a new one.")
            return
        } else {
            const res = await passReset(token, newPass.Password)
            if (res.success) {
                if (res.message) toast.success(res.message)
                navigate("/login")
            } else {
                if (res.message) toast.error(res.message)
            }
        }
    }

    const onerror = async (err: any) => {
        if (err.Password?.message) {
            toast.error(err.Password?.message)
        }
    }

    if (isAuthChecking) return <PageLoader />

    return (
        <div className="flex justify-center items-center bg-linear-to-br from-[#1a1a1a] via-[#131313] to-[#020403] w-screen h-screen min-h-80 xsm:min-h-90">
            <form onSubmit={handleSubmit(onSubmit, onerror)} className="w-70 xs:w-80 xsm:w-100 flex flex-col gap-6 items-center ">
                <div className="flex flex-col items-center gap-3 w-full">
                    <div className="flex justify-center items-center gap-4">
                        <img className="size-10 xs:size-12" src={assets.logo} alt="logo" />
                        <span className="uppercase font-bold text-lg xsm:text-2xl text-white">inlango</span>
                    </div>
                    <span className="text-[10px] xs:text-sm font-bold font-sans tracking-widest text-white/70 text-center">Reset your password to regain access to your account</span>
                    <div className="flex flex-col gap-1.5 relative w-full mt-4">
                        <span className="text-white/70 text-sm xsm:text-base font-semibold font-Padauk">Password</span>
                        <input
                            {...register("Password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password should be of atleast 8 charcters"
                                }, maxLength: {
                                    value: 20,
                                    message: "Password should not be more then 20 charcters"
                                }
                            })}
                            placeholder="Karan@246"
                            type={passEye ? "password" : "text"}
                            className='w-full border text-xs xs:text-base border-white/40 rounded-lg py-2 xsm:py-2.5 pr-10 outline-none px-4 focus:border-[#38BBAD]/40 focus:shadow-[0_0_10px_#38BBAD]/40'
                        />
                        <button
                            type="button"
                            onClick={() => setpassEye(!passEye)}
                            className="cursor-pointer absolute top-9 xsm:top-11 right-4">
                            {passEye ? <Eye className="size-5 text-[#38BBAD]" /> : <EyeOff className="size-5 text-[#38BBAD]" />}
                        </button>
                    </div>
                </div>

                <button type="submit"
                    className="flex justify-center items-center gap-2 group w-full mt-2 py-1 sm:py-2 rounded-full text-black font-Padauk font-bold text-base sm:text-lg bg-[#46b4a9] cursor-pointer hover:bg-[#1fad9f] transition-all duration-300">
                    <span className="">Reset</span>
                    <ArrowRight className="size-4.5 group-hover:translate-x-1 transition-all duration-200 " />
                </button>
            </form>
        </div>
    )
}