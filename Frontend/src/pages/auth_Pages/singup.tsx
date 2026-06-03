import assets from "../../assets/assets.tsx"
import { useForm } from "react-hook-form"
import type { FieldErrors } from "react-hook-form"
import { authStore } from "../../store/userAuthStore.tsx";
import { useGoogleLogin } from "@react-oauth/google"
import { useEffect, useState } from "react";
import { Eye, EyeOff, ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../components/pageLoader.tsx";
import { Languages } from "../../assets/language.tsx";


export default function Registration() {

    const navigate = useNavigate()

    const { userData, isAuthChecking, checkAuth, singUp ,loginWithGoogle } = authStore()

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

    type SignUpData = {
        Username: string
        Email: string
        Password: string
        Language: string
    };

    const {
        register,
        handleSubmit,
        watch,
        setValue
    } = useForm<SignUpData>();

    const [passEye, setpassEye] = useState<boolean>(true)

    const [query, setQuery] = useState<string>("")

    const filterLanguages = Languages.filter((lang) => (
        lang.name.toLowerCase().startsWith(query.toLowerCase())
    ))

    useEffect(() => {
        const timmer = setTimeout(() => setQuery(""), 5000)
        return () => clearTimeout(timmer)
    }, [query])

    const onSubmit = async (data: SignUpData) => {
        const res = await singUp(data)
        if (res.success) {
            if (res.message) toast.success(res.message)
            navigate(`/verify-account/${res.Data}`)
        } else {
            if (res.message) toast.error(res.message)
        }
    }

    const onerror = async (err: FieldErrors<SignUpData>) => {

        const fieldOrder: (keyof SignUpData)[] = ["Username", "Email", "Password", "Language"]

        fieldOrder.forEach((filed, i) => {
            if (err[filed]?.message) {
                setTimeout(() => {
                    toast.error(err[filed]?.message as string)
                }, i * 500);
            }
        })
    }

    if (userData !== null) {
        navigate("/message")
    }
    const selectedLanguage = watch("Language");

    const handleSelect = (value: string) => {
        setValue("Language", value, { shouldValidate: true })
        setQuery("")

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
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
        toast.error("Google sign-in failed")
    }
    const googleLogin = useGoogleLogin({
        onSuccess: handleSuccess,
        onError: handleError,
        flow: 'auth-code',
        scope: 'email profile',
    })

    if (isAuthChecking) return <PageLoader />

    return (
        <div className="flex flex-col gap-1 justify-center items-center bg-linear-to-br from-[#1a1a1a] via-[#131313] to-[#020403] w-screen h-screen min-h-160 xs:min-h-175">
            <div onClick={() => navigate("/")} className="flex justify-center items-center gap-4 cursor-pointer">
                <img className="size-10 xs:size-12" src={assets.logo} alt="logo" />
                <span className="uppercase font-bold text-xl xs:text-2xl text-white">inlango</span>
            </div>
            <span className="text-[10px] sm:text-sm font-bold font-sans tracking-widest text-center text-white/70">Create your account to get started</span>
            <form onSubmit={handleSubmit(onSubmit, onerror)} className=" w-62 xs:w-80 sm:w-100 flex flex-col gap-2.5 xs:gap-4.5 my-5">
                <div className="flex flex-col gap-3 xs:gap-4">
                    <div className="flex flex-col gap-1 xs:gap-1.5">
                        <span className="text-white/70 text-sm xs:text-base font-semibold font-Padauk">Full Name</span>
                        <input
                            {...register("Username", {
                                required: "Username is required",
                                minLength: {
                                    value: 2,
                                    message: "Username must be at least 2 characters"
                                }
                            })}
                            placeholder="Karan Sharma"
                            type="text"
                            className='w-full text-xs xs:text-base border border-white/40 rounded-lg py-1.5 xs:py-2 outline-none px-4 focus:border-[#38BBAD]/40 focus:shadow-[0_0_10px_#38BBAD]/40'
                        />
                    </div>
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
                            className='w-full text-xs xs:text-base  border border-white/40 rounded-lg py-1.5 xs:py-2 outline-none px-4 focus:border-[#38BBAD]/40 focus:shadow-[0_0_10px_#38BBAD]/40'
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
                            className='w-full text-xs xs:text-base  border border-white/40 rounded-lg py-1.5 xs:py-2 pr-10 outline-none px-4 focus:border-[#38BBAD]/40 focus:shadow-[0_0_10px_#38BBAD]/40'
                        />
                        <button
                            type="button"
                            onClick={() => setpassEye(!passEye)}
                            className="cursor-pointer absolute bottom-2 xs:bottom-3 right-4">
                            {passEye ? <Eye className="size-3.5 xs:size-5 text-[#38BBAD]" /> : <EyeOff className="size-5 text-[#38BBAD]" />}
                        </button>
                    </div>
                    <div className="flex flex-col gap-1 xs:gap-1.5">
                        <span className="text-white/70 text-sm xs:text-base font-semibold font-Padauk">Language</span>
                        <div className="dropdown group w-full">
                            <div
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key == "Backspace") {
                                        setQuery((prev) => prev.slice(0, -1))
                                    }
                                    if (e.key.length === 1) {
                                        setQuery((prev) => (prev + e.key).toLowerCase())
                                    }
                                }}
                                role="button"
                                className={`w-full text-xs xs:text-base  cursor-pointer border border-white/40 rounded-lg flex justify-between items-center py-1.5 xs:py-2 px-4 outline-none transition-all
                            focus:border-[#38BBAD]/40 focus:shadow-[0_0_10px_#38BBAD]/40`}
                            >
                                {selectedLanguage || <span className="opacity-50">Select Language</span>}
                                <ChevronDown className="size-5" />
                            </div>
                            <ul
                                tabIndex={-1}
                                className="dropdown-content hidden group-focus-within:flex flex-col gap-2 overflow-y-auto max-h-40 bg-[#1a1a1a] rounded-box z-1 w-full p-2 shadow-2xl border border-white/10 mt-1"
                            >
                                {filterLanguages.map((lang) => (
                                    <li
                                        onClick={() => handleSelect(lang.name)}
                                        key={lang.code}
                                        className="py-1.5 px-2.5 text-xs xs:text-sm hover:bg-gray-400/20 rounded-lg cursor-pointer">
                                        <a>{lang.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <input
                            type="hidden"
                            {...register("Language", { required: "Selecting Language is required" })}
                        />

                    </div>
                </div>

                <button type="submit"
                    className="flex justify-center items-center gap-2 group w-full mt-2 py-1 sm:py-2 rounded-full text-black font-Padauk font-bold text-base sm:text-lg bg-[#55d1c5] cursor-pointer hover:bg-[#1fad9f] transition-all duration-300">
                    <span className="">Create Account</span>
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

                <div className="flex justify-between mt-2">
                    <div onClick={() => navigate("/")} className="w-fit flex items-center gap-1 xs:gap-2 cursor-pointer group">
                        <ArrowLeft className="size-3 xs:size-4 text-[#38BBAD] group-hover:text-[#60ccc1] transition-all duration-200" />
                        <span className="text-[#38BBAD] text-xs xs:text-sm font-semibold group-hover:text-[#60ccc1] transition-all duration-200">Go Back</span>
                    </div>

                    <div className="w-fit flex items-center gap-1 xs:gap-2">
                        <span className="text-white text-xs xs:text-sm">Have an account?</span>
                        <div onClick={() => navigate("/login")} className="flex items-center gap-2 cursor-pointer group">
                            <span className="text-[#38BBAD] text-xs xs:text-sm font-semibold group-hover:text-[#60ccc1] transition-all duration-200">Log in</span>
                            <ArrowRight className="size-3 xs:size-4 text-[#38BBAD] group-hover:text-[#60ccc1] transition-all duration-200" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}