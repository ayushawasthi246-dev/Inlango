import UserModel from "../models/user.js";
import jwt from "jsonwebtoken"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import { RestPassLink, SendOTP, Welcome } from "../utils/Mail.js";
import { genrateAcessToken, genrateRefreshToken } from "../utils/token.js";
import cloudinary from "../config/cloudinary.js";
import { oauth2Client } from '../config/GoogleApi.js'
import axios from 'axios'

export const register = async (req, res) => {

    const { Username, Email, Password, Language } = req.body;

    if (!Username || !Email || !Password || !Language) {
        return res.status(400).json({ success: false, message: "Missing Data" })
    }

    try {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!gmailRegex.test(Email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (Password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 chracters" })
        }

        let user = await UserModel.findOne({ Email })

        if (user && user.VerifiedAccount) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const HashPass = await bcrypt.hash(Password, 10)

        if (user) {
            user.Username = Username
            user.Email = Email
            user.Password = HashPass
            user.Language = Language

            if (user.VerifyCodeExpireAt && user.VerifyCodeExpireAt > Date.now()) {
                return res.status(200).json({ success: true, message: "Same OTP is valid for 5 min ", verificationToken: user.VerifyCodeToken })
            }
        } else {
            user = new UserModel({ Username, Email, Password: HashPass, Language })
        }

        const otp = String(Math.floor(Math.random() * 900000 + 100000))

        const HashOTP = await bcrypt.hash(otp, 10)

        user.VerifyCode = HashOTP

        const verifyToken = crypto.randomBytes(32).toString("hex");

        const hashedVerifyToken = crypto
            .createHash("sha256")
            .update(verifyToken)
            .digest("hex");

        user.VerifyCodeToken = hashedVerifyToken
        user.VerifyCodeExpireAt = Date.now() + 5 * 60 * 1000

        await user.save()

        SendOTP({ Email: user.Email, otp })

        return res.status(200).json({ success: true, message: "Verification OTP has been sent to your email", verificationToken: verifyToken });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const verification = async (req, res) => {

    const { token } = req.params;
    const { otp } = req.body;

    if (!otp) return res.status(400).json({ success: false, message: "OTP is requried" })
    if (!token) return res.status(400).json({ success: false, message: "Your on wrong page, Please register again" })

    try {
        const VerifyCodeToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await UserModel.findOne({ VerifyCodeToken })

        if (!user) {
            return res.status(404).json({ success: false, message: "user not found, Please register again" })
        }

        if (user.VerifiedAccount) {
            return res.status(404).json({ success: false, message: "user already verified" })
        }

        const isOTPMatch = await bcrypt.compare(otp, user.VerifyCode)

        if (user.VerifyCode === "" || !isOTPMatch) {
            return res.status(400).json({ success: false, message: "Invalid Code" })
        }

        if (!user.VerifyCodeExpireAt || user.VerifyCodeExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP has been Expired" })
        }

        user.VerifiedAccount = true
        user.VerifyCode = ""
        user.VerifyCodeToken = ""
        user.VerifyCodeExpireAt = 0
        await user.save()

        const accessToken = genrateAcessToken(user._id)
        genrateRefreshToken(user._id, res)


        Welcome(user)

        return res.status(200).json({ success: "true", message: "Your email has been successfully verified and your account is now created", accessToken })


    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }

}

export const resendVerification = async (req, res) => {

    const { token } = req.params;

    if (!token) {
        return res.status(400).json({ success: false, message: "Your on wrong page, Please register again" })
    }
    try {
        const VerifyCodeToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const ExistingUser = await UserModel.findOne({ VerifyCodeToken })

        if (ExistingUser) {

            if (ExistingUser && ExistingUser.VerifiedAccount) {
                return res.status(400).json({ success: false, message: "User already exists" })
            }

            const otp = String(Math.floor(Math.random() * 900000 + 100000))

            const HashOTP = await bcrypt.hash(otp, 10)

            ExistingUser.VerifyCode = HashOTP
            ExistingUser.VerifyCodeExpireAt = Date.now() + 5 * 60 * 1000

            await ExistingUser.save()

            SendOTP({ Email: ExistingUser.Email, otp })

            return res.status(200).json({ success: true, message: "Verification OTP has been sent to your email" });

        } else {
            return res.status(400).json({ success: true, message: "User not exists , please register again" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const login = async (req, res) => {

    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.json({ success: false, message: "Missing Data" })
    }

    try {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!gmailRegex.test(Email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (Password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 chracters" })
        }

        const ExistingUser = await UserModel.findOne({ Email })

        if (!ExistingUser) {
            return res.status(404).json({ success: false, message: "User not exists" })
        }

        if (ExistingUser && !ExistingUser.VerifiedAccount) {
            return res.status(404).json({ success: false, message: "User not exists" })
        }

        if (!ExistingUser.Password) {
            return res.status(400).json({ success: false, message: "Your account was created with Google Sign-In. Please set a password to log in with email and password." })
        }

        const isMatch = await bcrypt.compare(Password, ExistingUser.Password)

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Password is incorrect" })
        }

        const accessToken = genrateAcessToken(ExistingUser._id)
        genrateRefreshToken(ExistingUser._id, res)

        return res.status(200).json({ success: "true", message: "logged In", accessToken })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("refreshToken")
        return res.status(200).json({ success: true, message: "User loged out" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const googleLogin = async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Authorization code missing. try again' });
    }

    try {
        const googleRes = await oauth2Client.getToken(code)
        oauth2Client.setCredentials(googleRes.tokens)
        const Refresh_Token = googleRes.tokens.refresh_token

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${googleRes.tokens.access_token}`
        )
        const { email, name, picture, id } = userRes.data

        let User = await UserModel.findOne({ Email: email })

        if (User) {
            if (!User.ProfilePic) User.ProfilePic = picture
            if (!User.GoogleId) User.GoogleId = id
            if (!User.Refresh_Token) User.Refresh_Token = Refresh_Token
            await User.save()
        } else {
            User = await UserModel.create({
                Username: name,
                Email: email,
                ProfilePic: picture,
                GoogleId: id,
                VerifiedAccount: true,
                Refresh_Token
            })
            Welcome(User)
        }
        const accessToken = genrateAcessToken(User._id)
        genrateRefreshToken(User._id, res)
        return res.status(200).json({ success: true, message: "Successfully logged in", accessToken })

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const refreshAccessToken = async (req, res) => {

    const { refreshToken } = req.cookies
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: "refresh token missing . please login again" });
    }

    try {
        const decode = jwt.verify(refreshToken, process.env.Refresh_SECRET)
        const Token = jwt.sign({ id: decode.id }, process.env.Access_SECRET, { expiresIn: "15m" })
        res.json({ success: true, accessToken: Token })
    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(440).json({ success: false, message: "Session Expired, Please login again" })
        }

        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const resetPassLink = async (req, res) => {

    const { Email } = req.body

    if (!Email) {
        return res.status(400).json({ success: false, message: "Please Enter your Email" })
    }

    try {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!gmailRegex.test(Email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        const user = await UserModel.findOne({ Email })

        if (!user) {
            return res.status(400).json({ success: false, message: "user not exists" })
        }

        if (user.PasswordRestTokenExpireAt && Date.now() - user.PasswordRestRequestedAt < 30 * 1000) {
            return res.status(200).json({ success: true, message: "Please wait 30 seconds before requesting again" })
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        RestPassLink({ user, token: resetToken })

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.PasswordRestToken = hashedToken;
        user.PasswordRestTokenExpireAt = Date.now() + 10 * 60 * 1000
        user.PasswordRestRequestedAt = Date.now()
        await user.save()

        return res.status(200).json({ success: true, message: "Reset Password link has been sent to your email, Please check" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const resendResetPassLink = async (req, res) => {

    const { Email } = req.body

    if (!Email) {
        return res.status(400).json({ success: false, message: "Please Enter the Email" })
    }

    try {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!gmailRegex.test(Email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        const user = await UserModel.findOne({ Email })

        if (!user) {
            return res.status(400).json({ success: false, message: "user not exists" })
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        RestPassLink({ user, token: resetToken })

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.PasswordRestToken = hashedToken;
        user.PasswordRestTokenExpireAt = Date.now() + 10 * 60 * 1000
        await user.save()

        return res.status(200).json({ success: true, message: "Reset Password link has been sent to your email" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const resetPass = async (req, res) => {
    const { token } = req.params
    const { newPass } = req.body;

    if (!token || !newPass) {
        return res.status(400).json({ success: false, message: "Please enter the Detail" })
    }

    try {

        if (newPass.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 chracters" })
        }

        const PasswordRestToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await UserModel.findOne({ PasswordRestToken })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not exists" })
        }

        if (!user.PasswordRestTokenExpireAt || user.PasswordRestTokenExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "This reset password link has been expired" })
        }

        const HashPass = await bcrypt.hash(newPass, 10)
        user.Password = HashPass
        user.PasswordRestToken = ""
        user.PasswordRestTokenExpireAt = 0
        await user.save()

        return res.status(201).json({ success: true, message: "Password has been changed" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }

}

export const uplodProfilePic = async (req, res) => {

    const { profilePic } = req.body

    if (!profilePic) {
        return res.status(400).json({ success: false, message: "Please upload your profile photo" })
    }
    try {
        const userID = req.user._id
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const user = await UserModel.findByIdAndUpdate(
            userID,
            { ProfilePic: uploadResponse.secure_url },
            { returnDocument: "after" }
        )
        return res.status(200).json({ success: true, message: "Profile picture has been uploaded", updatedUserPfpLink: user.ProfilePic })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const uplodProfile = async (req, res) => {

    const { newUsername, newLang } = req.body

    if (!newUsername && !newLang) {
        return res.status(400).json({ success: false, message: "Please Enter the detail" })
    }
    try {
        const userID = req.user._id

        const user = await UserModel.findByIdAndUpdate(
            userID,
            {
                Username: newUsername,
                Language: newLang
            },
            { returnDocument: "after" }
        )
        return res.status(200).json({ success: true, message: "Profile has been uploaded", updatedUser: user })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const markTranslationDisclaimerSeen = async (req, res) => {
    try {
        await UserModel.findByIdAndUpdate(req.user._id, { translationDisclaimerSeen: true })

        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json({success: false,message: error.message})
    }
}
