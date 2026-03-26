import sendMail from "../config/nodemail.js";

export const SendOTP = async ({Email , otp}) => {

    if (!Email || !otp) {
        return ({ success: false, message: "something went wrong, please try again" })
    }

    try {

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                    <meta charset="UTF-8">
                    <title>OTP Email</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; margin:0; padding:0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center">
                        <table width="400" cellpadding="0" cellspacing="0" style="background-color:#fff; padding:20px;">
                            <tr>
                            <td align="center" style="font-size:24px; font-weight:bold; color:#333;">
                                "Verify Your Account" }
                            </td >
                            </tr >
                            <tr>
                            <td style="padding:20px 0; font-size:18px; color:#555; text-align:center;">
                            Your OTP is 
                            <div style="font-size:30px; font-weight:bold; color:#1a73e8; margin:15px 0; letter-spacing: 4px;"> ${otp}</div>
                            Please use this OTP to "verify your Inlango account and complete your registration."
                            </td>
                            </tr>
                            <tr>
                            <td style="font-size:15px; color:#999; text-align:center;">
                                If you did not request this OTP, please ignore this email or contact us if you have any concerns.
                                </td>
                                </tr>
                                </table >
                                </td >
                                </tr >
                                </table >
                                </body >
                                </html >
    `
        const subject = "Account Verification OTP";

        const success = await sendMail(Email, subject, html);

        if (!success) {
            return ({ success: false, message: "Failed to send OTP" });
        }
        return ({ success: true, message: "OTP has been sent to your email" });
    } catch (error) {
        console.error("Error in register controller : ", error)
        return ({ success: false, message: "Internal server error" })
    }
}

export const Welcome = async (user) => {

    if (!user) {
        return ({ success: false, message: "something went wrong, please try again" })
    }

    try {

        if (!user.verifiedAccount) {
            return ({ success: false, message: "User already exists" })
        }

        const html = `
        <!DOCTYPE html >
        <html>
        <head>
            <meta charset="UTF-8" />
            <title>Welcome Email</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f3f3f3; font-family: Arial, sans-serif;">
                <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; overflow: hidden;">
                    <div style="padding: 5px 30px; text-align: center;">
                        <h1 style="font-size: 30px; color: #111111; margin-bottom: 20px;">Welcome to Inlango!</h1>
                        <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 20px;">
                            Hey there! 🎉 Your email has been successfully verified.
                        </p>
                        <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 35px;">
                            More than just messaging, Inlango creates a space where language is no longer a barrier — you speak your way, and they read it in theirs, with everything handled seamlessly in the background.
                        </p>
                    </div>

                    <div style="background-color: #111111; color: #ffffff; text-align: center; padding: 25px;">
                        <p style="font-size: 14px; margin-bottom: 25px;">
                            We'd love to hear from you! If you ever face any issues or want to share your experience, you can raise it here:
                        </p>

                        <a href="mailto:${process.env.SENDER_EMAIL}" target="_blank"
                            style="font-size: 14px; background-color: #ffffff; color: #111111; text-decoration: none; padding: 14px 28px; border-radius: 25px; font-weight: bold; display: inline-block;">
                            Share Feedback
                        </a>

                        <p style="font-size: 14px; color: #ffffff91; margin-top: 25px;">
                            If you did not request this verification, please ignore this email or let us know.
                        </p>
                    </div>
                </div>
            </body>
        </html>
`
        const success = await sendMail(user.Email, "Welcome to Inlango", html);

        if (!success) {
            return ({success: false,message: "Failed to send OTP"});
        }

        return ({success: true,message: "OTP has been sent to your email"});

    } catch (error) {
        console.error("Error in register controller : ", error)
        return ({ success: false, message: "Internal server error" })
    }
}

export const RestPassLink = async ({user , token}) => {

    if (!token) {
        return ({ success: false, message: "something went wrong, please try again" })
    }

    try {

        const html =
            `<!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8" />
            <title>Password Reset</title>
            </head>

            <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px;">
                <tr>
                <td align="center">

                    <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">

                    <tr>
                        <td align="center" style="padding-bottom:20px;">
                        <h2 style="margin:0; color:#333;">Reset Your Password</h2>
                        </td>
                    </tr>

                    <tr>
                        <td style="color:#555; font-size:16px; line-height:1.6;">
                        <p>Hi , ${user.Username}</p>

                        <p>You requested to reset your password. Click the button below to set a new one:</p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding:25px 0;">
                        <a href="http://localhost:3000/auth/resetpass/${token}"
                            style="background-color:#4CAF50; color:white; padding:12px 25px; text-decoration:none; border-radius:6px; font-size:16px; display:inline-block;">
                            Reset Password
                        </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="color:#777; font-size:14px; line-height:1.5;">
                        <p>If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="word-break:break-all; color:#4CAF50;">
                            "http://localhost:3000/auth/resetpass/${token}"
                        </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top:20px; color:#999; font-size:13px;">
                        <p>This link will expire in 10 minutes.</p>
                        <p>If you didn’t request this, you can safely ignore this email.</p>
                        </td>
                    </tr>
                    </table>

                </td>
                </tr>
            </table>

            </body>
            </html>`

        const success = await sendMail(user.Email, "Reset Your current Password", html);

        if (!success) {
            return ({success: false,message: "Failed to send mail"});
        }

        return ({success: true,message: "Reset password link has been sent to your email"});


    } catch (error) {
        console.error("Error in register controller : ", error)
        return ({ success: false, message: "Internal server error" })
    }
}