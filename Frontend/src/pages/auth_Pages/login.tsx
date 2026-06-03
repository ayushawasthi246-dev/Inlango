import assets from "../../assets/assets.tsx"
import { useForm, type FieldErrors } from "react-hook-form"
import { authStore } from "../../store/userAuthStore.tsx";
import { useGoogleLogin } from "@react-oauth/google"
import { useEffect, useState } from "react";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import PageLoader from "../../components/pageLoader.tsx";
import toast from "react-hot-toast";

export default function login() {

    const navigate = useNavigate()
    const { isAuthChecking, checkAuth, login, forgetPassLink, loginWithGoogle } = authStore()

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

    type loginData = {
        Email: string;
        Password: string;
    };

    const {
        register,
        handleSubmit,
        watch,
    } = useForm<loginData>();

    const watchEmail = watch("Email", "")

    const [passEye, setpassEye] = useState<boolean>(true)

    const onSubmit = async (data: loginData) => {
        const res = await login(data.Email, data.Password)
        if (res.success) {
            if (res.message) toast.success(res.message)
            navigate("/message")
        } else {
            if (res.message) toast.error(res.message)
        }
    }

    const forgetPass = async () => {
        const res = await forgetPassLink(watchEmail)
        if (res.success) {
            if (res.message) toast.success(res.message)
        } else {
            if (res.message) toast.error(res.message)
        }
    }

    const onerror = async (err: FieldErrors<loginData>) => {

        const fieldOrder: (keyof loginData)[] = ["Email", "Password"]

        fieldOrder.forEach((filed, i) => {
            if (err[filed]?.message) {
                setTimeout(() => {
                    toast.error(err[filed]?.message as string)
                }, i * 500);
            }
        })
    }

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
        toast.error("Google Log-in failed")
    }
    const googleLogin = useGoogleLogin({
        onSuccess: handleSuccess,
        onError: handleError,
        flow: 'auth-code',
        scope: 'email profile',
    })

    if (isAuthChecking) return <PageLoader />

    return (
        <div className="flex flex-col gap-2 justify-center items-center bg-linear-to-br from-[#1a1a1a] via-[#131313] to-[#020403] w-screen h-screen min-h-140 xs:min-h-160">
            <div onClick={() => navigate("/")} className="flex justify-center items-center gap-4 cursor-pointer">
                <img className="size-10 xs:size-12" src={assets.logo} alt="logo" />
                <span className="uppercase font-bold text-xl xs:text-2xl text-white">inlango</span>
            </div>
            <span className="text-[10px] xs:text-sm font-bold font-sans tracking-widest text-white/70 text-center">Welcome back! Please sign in to continue</span>
            <form onSubmit={handleSubmit(onSubmit, onerror)} className="w-62 xs:w-80 sm:w-100 flex flex-col gap-4 xs:gap-5 my-5">
                <div className="flex flex-col gap-3 xs:gap-4">
                    <div className="flex flex-col gap-1 xs:gap-1.5">
                        <span className="text-white/70 text-sm xs:text-base font-semibold font-Padauk">Email</span>
                        <input
                            {...register("Email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter the valid mail"
                                }
                            })}
                            placeholder="karan@example.com"
                            type="text"
                            className='w-full text-xs xs:text-base border border-white/40 rounded-lg py-2 xs:py-2.5 outline-none px-4 focus:border-[#38BBAD]/40 focus:shadow-[0_0_10px_#38BBAD]/40'
                        />
                    </div>
                    <div className="flex flex-col gap-1 xs:gap-1.5 relative">
                        <span className="text-white/70 text-sm xs:text-base font-semibold font-Padauk">Password</span>
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
                            placeholder={`${passEye ? "* * * * * * * *" : "Karan@246"}`}
                            type={passEye ? "password" : "text"}
                            className='w-full text-xs xs:text-base border border-white/40 rounded-lg py-2 xs:py-2.5 outline-none px-4 pr-10 focus:border-[#38BBAD]/40 focus:shadow-[0_0_10px_#38BBAD]/40'
                        />
                        <button
                            type="button"
                            onClick={() => setpassEye(!passEye)}
                            className="cursor-pointer absolute top-8.5 xs:top-11 right-4">
                            {passEye ? <Eye className="size-3.5 xs:size-5 text-[#38BBAD]" /> : <EyeOff className="size-5 text-[#38BBAD]" />}
                        </button>
                        <span onClick={() => forgetPass()} className="w-fit text-sm xs:text-base font-Padauk cursor-pointer mt-2 text-[#60ccc1] hover:text-[#02bdaa] transition-all duration-200">Forgot Password ?</span>
                    </div>
                </div>

                <button type="submit"
                    className="flex justify-center items-center gap-2 group w-full mt-2 py-1 sm:py-2 rounded-full text-black font-Padauk font-bold text-base sm:text-lg bg-[#46b4a9] cursor-pointer hover:bg-[#1fad9f] transition-all duration-300">
                    <span className="">Login</span>
                    <ArrowRight className="size-4.5 group-hover:translate-x-1 transition-all duration-200 " />
                </button>

                <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-300/50"></div>
                    <span className="mx-4 text-white/50 text-xs">OR</span>
                    <div className="flex-1 border-t border-gray-300/50"></div>
                </div>

                <button onClick={googleLogin} type="button"
                    className="w-full py-2 xs:py-2.5 rounded-full text-black font-Padauk text-base xs:text-lg border border-white/60 flex justify-center items-center gap-5 cursor-pointer hover:border-white transition-all duration-300 group">
                    <img src={assets.google} alt="google" className="size-3.5 sm:size-4.5 group-hover:scale-105 transition-all duration-200" />
                    <span className="text-white text-sm sm:text-base group-hover:scale-105 transition-all duration-200">Sing up with Google</span>
                </button>

                <div className="flex justify-between">
                    <div onClick={() => navigate("/")} className="w-fit flex items-center gap-1 xs:gap-2 cursor-pointer group">
                        <ArrowLeft className="size-3 xs:size-4 text-[#38BBAD] group-hover:text-[#60ccc1] transition-all duration-200" />
                        <span className="text-[#38BBAD] text-xs xs:text-sm font-semibold group-hover:text-[#60ccc1] transition-all duration-200">Go Back</span>
                    </div>

                    <div className="w-fit flex items-center gap-1 xs:gap-2">
                        <span className="text-white text-sm xs:text-sm">No account?</span>
                        <div onClick={() => navigate("/registration")} className="flex items-center gap-2 cursor-pointer group">
                            <span className="text-[#38BBAD] text-xs xs:text-sm font-semibold group-hover:text-[#60ccc1] transition-all duration-200">Sign up</span>
                            <ArrowRight className="size-3 xs:size-4 text-[#38BBAD] group-hover:text-[#60ccc1] transition-all duration-200" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}