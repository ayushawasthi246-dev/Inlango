import axios from "axios";
import { create } from "zustand";
import { authStore } from "./userAuthStore";

const serverURL = import.meta.env.VITE_BACKEND_URL

type Response = {
    success: boolean;
    message?: string;
    Data?: any;
}

type ChatPartner = {
    _id: string
    Username: string,
    ProfilePic: string,
}

type ChatMessage = {
    _id: string
    ReceiverID: string,
    SenderID: string,
    Text: string,
    TranslatedText: string,
    Image?: string,
    Seen: boolean,
    createdAt: Date,
    status?: "sending" | "sent" | "failed"
}

type Media = {
    _id: string,
    Image: string,
    ReceiverID: string,
    SenderID: string,
    createdAt: Date
}

type message = {
    Text?: string,
    Image?: string,
    translation: boolean
}

type messageStoreType = {
    allUsers: ChatPartner[],
    media: Media[],
    allChatPartner: ChatPartner[],
    messages: ChatMessage[],
    isTranslation: boolean,
    activeTab: "chats" | "search" | "user" | null,
    isSidebarOpen: boolean,
    activeChatPartner: ChatPartner | null,
    isShowMedia: boolean,
    isUserLoading: boolean,
    isMediaLoading: boolean,
    isMessageloading: boolean,

    setActiveTab: (tab: "chats" | "search" | "user" | null) => void,
    setIsTranslation: () => void,
    addChatPartner: (partner: ChatPartner) => void,
    setActiveChatPartner: (Partner: ChatPartner | null) => void,
    setIsSidebarOpen: (Open: boolean) => void,
    getallUsers: (accessToken: string) => Promise<Response>,
    getAllChats: (accessToken: string) => Promise<Response>,
    getMedia: (accessToken: string) => Promise<Response>,
    setShowMedia: (show: boolean) => void,
    chatPartnerMessages: (patnerID: string, accessToken: string) => Promise<Response>,
    sendMessage: (messageData: message, accessToken: string) => Promise<Response>,
    deleteMessage: (messageId: string, accessToken: string) => Promise<Response>,
    subscribeToMessage: () => void,
    unSubscribeToMessage: () => void,
}

export const messageStore = create<messageStoreType>((set, get) => ({
    allUsers: [],
    media: [],
    allChatPartner: [],
    messages: [],
    isTranslation: false,
    activeTab: window.innerWidth >= 1024 ? "chats" : null,
    isSidebarOpen: false,
    activeChatPartner: null,
    isShowMedia: false,
    isUserLoading: true,
    isMessageloading: true,
    isMediaLoading: true,

    setActiveTab: (tab: "chats" | "search" | "user" | null) => {
        set({ activeTab: tab })
    },

    addChatPartner: (partner: ChatPartner) => {
        set((state) => {
            const exists = state.allChatPartner.some(
                (ch) => ch._id.toString() === partner._id.toString()
            );
            if (!exists) {
                return { allChatPartner: [partner, ...state.allChatPartner] };
            }
            return {};
        });
    },

    setIsTranslation: () => {
        set({ isTranslation: !get().isTranslation })
    },

    setActiveChatPartner: (Partner: ChatPartner | null) => {
        set({
            activeChatPartner: Partner ? { ...Partner } : null,
            isSidebarOpen: false
        })
    },

    setIsSidebarOpen: async (Open: boolean) => {
        set({ isSidebarOpen: Open })
    },

    getallUsers: async (accessToken: string) => {
        set({ isUserLoading: true })
        try {
            const res = await axios.get(serverURL + "/message/allUsers", { headers: { Authorization: `Bearer ${accessToken}` } })
            if (res.data?.success) {
                if (res.data.allUsers.length === 0) {
                    set({ allUsers: [] })
                    return { success: res.data?.success }
                }
                set({ allUsers: res.data.allUsers })
                return { success: res.data?.success }
            } else {
                return { success: res.data?.success, message: res.data?.message }
            }
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || "Something went wrong" }
        } finally {
            set({ isUserLoading: false })
        }
    },

    getAllChats: async (accessToken: string) => {
        set({ isUserLoading: true })
        try {
            const res = await axios.get(serverURL + "/message/chats", { headers: { Authorization: `Bearer ${accessToken}` } })
            if (res.data?.success) {
                if (res.data.chatPartner.length === 0) {
                    set({ allChatPartner: [] })
                    return { success: res.data?.success }
                }
                set({ allChatPartner: res.data.chatPartner })
                return { success: res.data?.success }
            } else {
                return { success: res.data?.success, message: res.data?.message }
            }
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || "Something went wrong" }
        } finally {
            set({ isUserLoading: false })
        }
    },

    getMedia: async (accessToken: string) => {
        set({ isMediaLoading: true })
        try {
            const res = await axios.get(serverURL + "/message/media", { headers: { Authorization: `Bearer ${accessToken}` } })
            if (res.data?.success) {
                if (res.data.media.length === 0) {
                    set({ media: [] })
                    return { success: res.data?.success }
                }
                set({ media: res.data.media })

                return { success: res.data?.success }
            } else {
                return { success: res.data?.success, message: res.data?.message }
            }
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || "Something went wrong" }
        } finally {
            set({ isMediaLoading: false })
        }
    },

    setShowMedia: async (show: boolean) => {
        set({ isShowMedia: show })
    },

    chatPartnerMessages: async (patnerID: string, accessToken: string) => {
        set({ isMessageloading: true })
        try {
            const res = await axios.get(serverURL + `/message/${patnerID}`, { headers: { Authorization: `Bearer ${accessToken}` } })
            if (res.data?.success) {
                set({ messages: res.data.chatMessages })
                return { success: res.data?.success }
            } else {
                return { success: res.data?.success, message: res.data?.message }
            }
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || "Something went wrong" }
        } finally {
            set({ isMessageloading: false })
        }
    },

    sendMessage: async (messageData: message, accessToken: string) => {
        const { activeChatPartner, addChatPartner, setActiveTab, activeTab } = get()
        const { userData } = authStore.getState()
        const tempId = Date.now();
        try {
            const newMsg: ChatMessage = {
                _id: tempId.toString(),
                SenderID: userData?._id || "",
                ReceiverID: activeChatPartner?._id || "",
                Text: messageData.Text || "",
                TranslatedText: messageData.Text || "",
                Image: messageData.Image || "",
                createdAt: new Date(),
                Seen: false,
                status: "sending"
            }
            set((state) => ({ messages: [...state.messages, newMsg] }))
            if (activeChatPartner) {
                const res = await axios.post(serverURL + `/message/send/${activeChatPartner._id}`, messageData, { headers: { Authorization: `Bearer ${accessToken}` } })
                if (res.data?.success) {
                    addChatPartner(activeChatPartner)
                    if (activeTab !== "chats") {
                        setActiveTab("chats")
                    }
                    set((state) => ({
                        messages: state.messages.map((msg) =>
                            msg._id === tempId.toString() ? res.data.NewMessage : msg
                        )
                    }))
                    return { success: res.data?.success }
                } else {
                    return { success: res.data?.success, message: res.data?.message }
                }
            }
            return { success: false, message: "Can't find the user" }
        } catch (err: any) {
            set((state) => ({ messages: state.messages.map((msg) => msg._id === tempId.toString() ? { ...msg, status: "failed" } : msg) }));
            return { success: false, message: err.response?.data?.message || "Something went wrong" }
        }
    },

    deleteMessage: async (messageId: string, accessToken: string) => {
        try {
            const res = await axios.delete(`${serverURL}/message/delete/${messageId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (res.data?.success) {
                set((state) => ({
                    messages: state.messages.filter((msg) => msg._id !== messageId)
                }));
                return { success: true }
            } else {
                return { success: false, message: res.data?.message }
            }
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || "Failed to delete message" }
        }
    },

    subscribeToMessage: () => {
        const socket = authStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage");
        socket.off("messageDeleted");

        socket.on("newMessage", (newMessage) => {
            const { activeChatPartner, addChatPartner, messages, allUsers } = get();
            if (newMessage.SenderID) {
                const currentAllUsers = allUsers;

                const foundUser = currentAllUsers.find(
                    (user) => user._id.toString() === newMessage.SenderID.toString()
                );

                if (foundUser) {
                    addChatPartner(foundUser);
                } else {
                    if (newMessage.sender) {
                        get().addChatPartner(newMessage.sender);
                    }
                }
            }
            if (activeChatPartner && newMessage.SenderID === activeChatPartner._id) {
                const isDuplicate = messages.some(msg => msg._id === newMessage._id);
                if (!isDuplicate) {
                    set({ messages: [...messages, newMessage] });
                }
            }
        });

        socket.on("messageDeleted", (deletedMessageId) => {
            set((state) => ({
                messages: state.messages.filter((msg) => msg._id !== deletedMessageId)
            }));
        });
    },

    unSubscribeToMessage: () => {
        const socket = authStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
            socket.off("messageDeleted");
        }
    },
}))
