// middlewares/verifyToken.js
import 'dotenv/config'; 

const verifyApiKey = (req, res, next) => {
    // 1️⃣ Get API key from request header or query
    const apiKeyHeader = req.headers["x-api-key"];
    const apiKeyQuery = req.query.apiKey;
    const apiKey = apiKeyHeader || apiKeyQuery;

    // 2️⃣ Check if API key is sent in request
    if (!apiKeyHeader && !apiKeyQuery) {
        return res.status(403).json({
            error: "Forbidden: Missing API key in request",
            hint: "Send the key in header 'x-api-key' or as query parameter 'apiKey'"
        });
    }

    // 3️⃣ Check if API key is defined in environment
    const API_KEY = process.env.WHATSAPP_API_KEY;
    if (!API_KEY) {
        return res.status(500).json({
            error: "Server misconfiguration: API key not set in environment",
            hint: "Make sure WHATSAPP_API_KEY is defined in your .env file"
        });
    }

    // 4️⃣ Check for conflicting keys
    if (apiKeyHeader && apiKeyQuery && apiKeyHeader !== apiKeyQuery) {
        return res.status(400).json({
            error: "Bad Request: Conflicting API keys in request",
            headerKey: apiKeyHeader,
            queryKey: apiKeyQuery,
            hint: "Ensure only one API key is sent or both are the same"
        });
    }

    // 5️⃣ Validate API key
    if (apiKey !== API_KEY) {
        return res.status(403).json({
            error: "Forbidden: Invalid API key",
            receivedKey: apiKey,
            hint: "Check your key in .env and in your request"
        });
    }

    // ✅ All checks passed
    next();
};

export default verifyApiKey;
