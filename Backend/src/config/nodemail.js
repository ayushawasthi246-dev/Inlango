import { google } from "googleapis";

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendMail(to, subject, html) {
    try {
        const rawMessage = Buffer.from(
            `From: "Inlango" <${process.env.SENDER_EMAIL}>\r\n` +
            `To: ${to}\r\n` +
            `Subject: ${subject}\r\n` +
            `Content-Type: text/html; charset=utf-8\r\n\r\n` +
            `${html}`
        )
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
        await gmail.users.messages.send({
            userId: "me",
            requestBody: { raw: rawMessage },
        });
        return true;
    } catch (err) {
        return false;
    }
}

export default sendMail;
