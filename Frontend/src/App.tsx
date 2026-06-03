import { Route, Routes } from "react-router-dom"
import { GoogleOAuthProvider } from "@react-oauth/google"
import Homepage from "./pages/homePage.tsx"
import Registration from "./pages/auth_Pages/singup.tsx"
import Login from "./pages/auth_Pages/login.tsx"
import VerifyAccount from "./pages/auth_Pages/account_verify.tsx"
import ResetPassword from "./pages/auth_Pages/reset_password.tsx"
import Messaging from "./pages/messagingPage.tsx"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-account/:token" element={<VerifyAccount />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/message" element={<Messaging />} />
      </Routes>
      <Toaster />
    </GoogleOAuthProvider>
  )
}

export default App
