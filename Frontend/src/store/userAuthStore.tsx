import axios from 'axios'
import { create } from 'zustand'
import { io, Socket } from 'socket.io-client';

const serverURL = import.meta.env.VITE_BACKEND_URL

type SignUpData = {
  Username: string;
  Email: string;
  Password: string;
};

type Response = {
  success: boolean;
  message?: string;
  Data?: any;
}

type userData = {
  _id: string,
  Username: string,
  Email: string,
  ProfilePic: string,
  createdAt: Date,
  Language: string,
  translationDisclaimerSeen?: boolean
}

type GoogleAuthResult = {
  code: string
}

type authStoreType = {
  userData: userData | null,
  isAuthChecking: boolean,
  accessToken: string | null,
  onlineUser: Array<string>,
  socket: Socket | null,
  uploadProfilePic: (image: string) => Promise<Response>
  markDeclaimerSeen: () => Promise<Response>
  uploadProfile: (newUsername: string, newLang: string) => Promise<Response>
  checkAuth: () => Promise<Response>,
  singUp: (userData: SignUpData) => Promise<Response>,
  loginWithGoogle: (authResult: GoogleAuthResult) => Promise<Response>,
  otpSubmit: (token: string, otp: string) => Promise<Response>,
  resendOTP: (token: string) => Promise<Response>,
  login: (Email: string, Password: string) => Promise<Response>,
  logout: () => Promise<Response>,
  forgetPassLink: (Email: string) => Promise<Response>,
  passReset: (token: string, newPass: string) => Promise<Response>,
  connectSocket: () => void,
}

export const authStore = create<authStoreType>((set, get) => ({
  userData: null,
  isAuthChecking: true,
  accessToken: null,
  onlineUser: [],
  socket: null,

  uploadProfile: async (newUsername: string, newLang: string) => {
    try {
      const res = await axios.put(serverURL + "/auth/uplodProfile", { newUsername, newLang }, { headers: { Authorization: `Bearer ${get().accessToken}` } })
      if (res.data?.success) {
        set((state) => ({
          userData: state.userData
            ? {
              ...state.userData,
              Username: res.data.updatedUser.Username,
              Language: res.data.updatedUser.Language
            }
            : state.userData
        }))
        return { success: res.data?.success }
      } else {
        return { success: res.data?.success, message: res.data?.message }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong"
      return { success: false, message: errorMessage }
    }
  },

  markDeclaimerSeen: async () => {
    try {
      const res = await axios.patch(serverURL + "/auth/translation-disclaimer-seen", {}, { headers: { Authorization: `Bearer ${get().accessToken}` } })
      if (res.data?.success) {
        set((state) => ({
          userData: state.userData
            ? {
              ...state.userData,
              translationDisclaimerSeen: true
            }
            : state.userData
        }));
        return { success: res.data?.success }
      } else {
        return { success: res.data?.success, message: res.data?.message }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong"
      return { success: false, message: errorMessage }
    }
  },

  uploadProfilePic: async (image: string) => {
    const prevProfilePic = get().userData?.ProfilePic
    set((state) => ({
      userData: state.userData
        ? { ...state.userData, ProfilePic: image }
        : state.userData
    }))
    try {
      const res = await axios.put(serverURL + "/auth/uplodProfilePic", { profilePic: image }, { headers: { Authorization: `Bearer ${get().accessToken}` } })
      if (res.data?.success) {
        set((state) => ({
          userData: state.userData
            ? { ...state.userData, ProfilePic: res.data.updatedUserPfpLink }
            : state.userData
        }))
        return { success: res.data?.success }
      } else {
        if (prevProfilePic)
          set((state) => ({
            userData: state.userData
              ? { ...state.userData, ProfilePic: prevProfilePic }
              : state.userData
          }))
        return { success: res.data?.success, message: res.data?.message }
      }
    } catch (err: any) {
      if (prevProfilePic)
        set((state) => ({
          userData: state.userData
            ? { ...state.userData, ProfilePic: prevProfilePic }
            : state.userData
        }))

      const errorMessage = err.response?.data?.message || err.message || "Something went wrong"
      return { success: false, message: errorMessage }
    }
  },

  checkAuth: async () => {
    let token = get().accessToken
    try {
      if (!token) {
        const res = await axios.get(serverURL + "/auth/refreshAccessToken", { withCredentials: true })
        if (res.data?.success) {
          token = res.data.accessToken
          set({ accessToken: res.data.accessToken })
        } else {
          return { success: res.data?.success, message: res.data?.message }
        }
      }
      const res = await axios.get(serverURL + "/auth/checkAuth", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.data?.success) {
        set({ userData: res.data.userData })
        get().connectSocket()

        return { success: res.data?.success, message: res.data?.message }
      } else {
        return { success: res.data?.success, message: res.data?.message }
      }
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401) {
        return { success: false }
      }
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
      return { success: false, message: errorMessage }
    } finally {
      set({ isAuthChecking: false })
    }
  },

  loginWithGoogle: async (authResult: GoogleAuthResult) => {
    try {
      const res = await axios.post(serverURL + '/auth/loginWithGoogle', { code: authResult.code }, { withCredentials: true })
      if (res.data?.success) {
        set({ accessToken: res.data.accessToken })
        get().connectSocket()
        return { success: res.data?.success, message: res.data?.message }
      } else {
        set({ accessToken: null })
        return { success: res.data?.success, message: res.data?.message }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
      return { success: false, message: errorMessage }
    }
  },

  singUp: async (userData: SignUpData) => {
    try {
      const res = await axios.post(serverURL + "/auth/register", userData)
      if (res.data?.success) {
        get().connectSocket()
        return { success: res.data?.success, message: res.data?.message, Data: res.data.verificationToken }
      } else {
        return { success: res.data?.success, message: res.data?.message, Data: null }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong"
      return { success: false, message: errorMessage, Data: null }
    }
  },

  otpSubmit: async (token: string, otp: string) => {
    try {
      const res = await axios.post(serverURL + `/auth/verification/${token}`, { otp }, { withCredentials: true })

      if (res.data?.success) {
        set({ accessToken: res.data.accessToken })
        return { success: res.data?.success, message: res.data?.message }
      } else {
        set({ accessToken: null })
        return { success: res.data?.success, message: res.data?.message }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
      return { success: false, message: errorMessage }
    }
  },

  resendOTP: async (token: string) => {
    try {
      const res = await axios.get(serverURL + `/auth/resendVerification/${token}`)
      if (res.data?.success) {
        return { success: res.data?.success, message: res.data?.message }
      } else {
        return { success: res.data?.success, message: res.data?.message }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
      return { success: false, message: errorMessage }
    }
  },

  login: async (Email: string, Password: string) => {
    try {
      const res = await axios.post(serverURL + "/auth/login", { Email, Password }, { withCredentials: true })
      if (res.data?.success) {
        set({ accessToken: res.data.accessToken })
        get().connectSocket()
        return { success: res.data?.success, message: res.data?.message }
      } else {
        set({ accessToken: null })
        return { success: res.data?.success, message: res.data?.message }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
      return { success: false, message: errorMessage }
    }
  },

  logout: async () => {
    try {
      const res = await axios.post(serverURL + "/auth/logout", {}, { withCredentials: true })
      if (res.data?.success) {
        set({ accessToken: null })
        return { success: res.data?.success, message: res.data?.message }
      } else {
        return { success: res.data?.success, message: res.data?.message }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
      return { success: false, message: errorMessage }
    }
  },

  forgetPassLink: async (Email: string) => {
    try {
      const res = await axios.post(serverURL + "/auth/resetPassLink", { Email })
      if (res.data?.success) {
        return { success: res.data?.success, message: res.data?.message }
      } else {
        return { success: res.data?.success, message: res.data?.message }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
      return { success: false, message: errorMessage }
    }
  },

  passReset: async (token: string, newPass: string) => {
    try {
      const res = await axios.put(serverURL + `/auth/resetPass/${token}`, { newPass })
      if (res.data?.success) {
        return { success: res.data?.success, message: res.data?.message }
      } else {
        return { success: res.data?.success, message: res.data?.message }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong"
      return { success: false, message: errorMessage }
    }
  },

  connectSocket: async () => {
    const { userData, socket } = get()

    if (!userData || socket?.connected) return

    const Socket = io(serverURL, { auth: { accessToken: get().accessToken } })

    Socket.connect()
    set({ socket: Socket })

    Socket.on("getOnlineUsers", (userIDs) => {
      set({ onlineUser: userIDs })
    })
  },

  disconnectSocket: async () => {
    const { socket, userData, onlineUser } = get();

    if (socket?.connected) {
      socket.disconnect();
    }

    if (userData?._id && onlineUser?.length) {
      const updatedOnlineUsers = onlineUser.filter(id => id !== userData._id);
      set({ onlineUser: updatedOnlineUsers });
    }
    set({ socket: null });
  }
}))