import { isSpoofedBot } from "@arcjet/inspect";
import aj from "../config/arcjet.js"

export const arcjetProtection = async (req,res,next) =>{
    try {
        const decision = await aj.protect(req)

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({success: false, message: "Rate Limit exceeded. Please try later"})
            }else if(decision.reason.isBot()){
                return res.status(403).json({success: false, message: "Bot access denied"})
            }else{
                return res.status(403).json({success: false, message: "Access denied by security policy"})
            }
        }
        
        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({success: false, error:"Spoofed bot detected",message: "Mailicious bot activity detected."})
        }

        next()

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}