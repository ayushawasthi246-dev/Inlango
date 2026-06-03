import { ChevronDown, CircleUser, PenLine } from "lucide-react"
import { authStore } from "../store/userAuthStore.tsx"
import { useRef, useState } from "react"
import toast from "react-hot-toast"
import { Languages } from "../assets/language.tsx"

export default function UserSetting() {

    const { userData, uploadProfilePic , uploadProfile } = authStore()

    const ProfileRef = useRef<HTMLInputElement | null>(null)

    const uploadedImg = async (profilePic: string) => {
        const res = await uploadProfilePic(profilePic)
        if (res.message) {
            if (res.success) {
                toast.success(res.message)
            } else {
                toast.error(res.message)
            }
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file?.type.startsWith("image/")) {
            toast.error("please select the Image !!")
            return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
            if (typeof reader.result === "string") {
                uploadedImg(reader.result)
            }
        }

        reader.readAsDataURL(file)
    }

    const [newUsername, setNewUsername] = useState<string>(userData?.Username || "")
    const [newLang, setNewLang] = useState<string>(userData?.Language || "")

    const handleNameChange = (e: any) => {
        const value = e.target.value;
        setNewUsername(value)
    }
    const [query, setQuery] = useState<string>("")

    const filterLanguages = Languages.filter((lang) => (
        lang.name.toLowerCase().startsWith(query.toLowerCase())
    ))

    const handleLangSelect = (Lang: string) => {
        setNewLang(Lang)
        setQuery("")

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }

    const [edit, setEdit] = useState<boolean>(false)

    const handleUpdate = async() => {

        if(newUsername.length < 2 ) toast.error("Username must be at least 2 characters")
        if(newUsername.trim() === "" ) toast.error("Username is required")
        if(newLang.trim() === "" ) toast.error("Selecting Language is required") 

        const res =  await uploadProfile(newUsername , newLang)
        if(res.message){
            if(!res.success) toast.error(res.message)
        }
        setEdit(false)
    }

    return (
        <div className="flex min-h-130 xsm:min-h-150 flex-col items-center justify-between h-full w-full mt-3 xsm:mt-5">
            <div className="flex flex-col items-center gap-3.5 xsm:gap-6 h-full w-full">
                <div className="relative w-fit">
                    <div className="size-24 xsm:size-26 sm:size-28 overflow-hidden border border-white/15 rounded-full">
                        {userData?.ProfilePic ?
                            <img src={userData?.ProfilePic} alt="ProfilePic" className="object-cover size-full" />
                            :
                            <CircleUser className="object-contain size-full" />
                        }
                        <input
                            type="file"
                            accept="image/*"
                            ref={ProfileRef}
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>
                    <PenLine onClick={() => ProfileRef.current?.click()} className="absolute size-7 xsm:size-9 sm:size-11 bottom-0 right-0 cursor-pointer hover:bg-gray-700 hover:scale-105 bg-gray-900 transition-all duration-200 border border-white/30 p-1.5 xsm:p-2.5 rounded-full" />
                </div>
                <div className="flex flex-col w-full gap-1 bg-gray-500/15 py-2 px-3 xsm:px-4 rounded-xl overflow-clip">
                    <span className="text-[11px] xs:text-xs sm:text-sm font-semibold font-sans text-[#38BBAD] tracking-wider">Name : </span>
                    {edit ?
                        <input
                            onChange={handleNameChange}
                            value={newUsername}
                            type="text"
                            className='w-full border border-white/40 rounded-lg my-1 py-1.5 xsm:py-2.5 outline-none px-2.5 xsm:px-4 focus:border-[#38BBAD]/40 focus:shadow-[0_0_10px_#38BBAD]/40'
                        /> :
                        <span className="text-base xsm:text-lg font-Padauk truncate text-white/80">{userData?.Username}</span>
                    }
                </div>
                <div className="flex flex-col w-full gap-1 bg-gray-500/15 py-2 px-3 xsm:px-4 rounded-xl overflow-clip">
                    <span className="text-[11px] xs:text-xs sm:text-sm font-semibold font-sans text-[#38BBAD] tracking-wider">Email : </span>
                    <span className="text-base xsm:text-lg font-Padauk truncate text-white/80">{userData?.Email}</span>
                </div>
                <div className="flex flex-col w-full gap-1 bg-gray-500/15 py-2 px-3 xsm:px-4 rounded-xl">
                    <span className="text-[11px] xs:text-xs sm:text-sm font-semibold font-sans text-[#38BBAD] tracking-wider">Language : </span>
                    {edit ?
                        <div className="dropdown group w-full my-1">
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
                                className={`w-full cursor-pointer border border-white/40 rounded-lg flex justify-between items-center py-1.5 xsm:py-2.5 px-2.5 xsm:px-4 outline-none transition-all
                            focus:border-[#38BBAD]/40 focus:shadow-[0_0_10px_#38BBAD]/40`}
                            >
                                {newLang}
                                <ChevronDown className="size-5" />
                            </div>
                            <ul
                                tabIndex={-1}
                                className="dropdown-content hidden group-focus-within:flex flex-col gap-2 overflow-y-auto max-h-40 bg-[#1a1a1a] rounded-box z-1 w-full p-2 shadow-2xl border border-white/10 mt-1"
                            >
                                {filterLanguages.map((lang) => (
                                    <li
                                        onClick={() => handleLangSelect(lang.name)}
                                        key={lang.code}
                                        className="py-1.5 px-2.5 hover:bg-gray-400/20 rounded-lg cursor-pointer">
                                        <a>{lang.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div> :
                        <span className="text-base xsm:text-lg font-Padauk text-white/80">{userData?.Language}</span>
                    }
                </div>
                <div className="flex flex-col w-full gap-1 bg-gray-500/15 py-2 px-3 xsm:px-4 rounded-xl">
                    <span className="text-[11px] xs:text-xs sm:text-sm font-semibold font-sans text-[#38BBAD] tracking-wider">Account Created : </span>
                    <span className="text-base xsm:text-lg font-Padauk text-white/80">{userData?.createdAt && new Date(userData?.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div className="w-full flex flex-col gap-4">
                <button
                    onClick={() => { edit ? handleUpdate() : setEdit(true) }} className="btn py-3 sm:py-5 w-full flex gap-3 bg-[#38BBAD]/70 hover:bg-[#41d8c9] transition-all duration-200 text-black text-sm xs:text-base sm:text-lg font-semibold rounded-xl">
                    {edit ? "Update" : "Edit"}
                </button>
            </div>
        </div>
    )
}