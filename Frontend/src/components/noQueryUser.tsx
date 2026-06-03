import { MessageCircleIcon } from "lucide-react";
import { messageStore } from "../store/messagesStore";
import { useState } from "react";

function NoQueyUserFound() {
  const { setActiveTab, activeTab } = messageStore()

  const [copied, setcopied] = useState(false)

  const handleCopying = async (link: string) => {
    await navigator.clipboard.writeText(link)
    setcopied(true)
    setTimeout(() => setcopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="w-16 h-16 bg-[#38BBAD]/10 rounded-full flex items-center justify-center">
        <MessageCircleIcon className="w-8 h-8 text-[#38BBAD]" />
      </div>
      <div>
        <h4 className="text-slate-200 font-medium mb-1">No matches found</h4>
        <p className="text-slate-400 text-sm px-6">
          {activeTab === "chats" ? "You might not have chatted with this person yet"
            : "This person doesn’t seem to be on the platform yet. Invite them to join so you can chat"}
        </p>
      </div>
      <button
        onClick={() => { activeTab === "chats" ? setActiveTab("search") : handleCopying(import.meta.env.VITE_CLIENT_URL) }}
        className="px-4 py-2 text-sm text-[#38BBAD] bg-[#38BBAD]/10 rounded-lg cursor-pointer hover:bg-[#38BBAD]/20 transition-colors"
      >
        {activeTab === "chats" ? "Find" : `${copied ? "copied!" : "Share App"}`}
      </button>
    </div>
  );
}
export default NoQueyUserFound;