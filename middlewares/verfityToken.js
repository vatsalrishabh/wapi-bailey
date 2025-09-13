// middlewares/verifyToken.js
require("dotenv").config()

const API_KEY = process.env.WHATSAPP_API_KEY

const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers["x-api-key"] || req.query.apiKey
    
    if (!apiKey || apiKey !== API_KEY) {
        return res.status(403).json({ error: "Forbidden: Invalid or missing API key" })
    }
    next()
}

module.exports = verifyApiKey
