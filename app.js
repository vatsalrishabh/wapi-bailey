// app.js
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys"
import qrcode from "qrcode-terminal"
import express from "express"
import swaggerJsDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import whatsappRoutes from "./routes/whatsappRoutes.js"
import verifyApiKey from "./middlewares/verfityToken.js"

const app = express()
const PORT = process.env.PORT || 3000
const API_KEY = process.env.WHATSAPP_API_KEY  

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "WhatsApp API",
            version: "1.0.0",
            description: "A WhatsApp API for sending messages without using WhatsApp Business API",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: "Development server",
            },
        ],
    },
    apis: ["./routes/*.js"],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

let sock // keep reference to WhatsApp socket

app.use(express.json()) // to parse JSON body

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info")

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    })

    sock.ev.on("connection.update", (update) => {
        const { connection, qr, lastDisconnect } = update

        if (qr) {
            qrcode.generate(qr, { small: true })
        }

        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode
            console.log("Connection closed. Reason:", reason)
            if (reason !== DisconnectReason.loggedOut) {
                connectToWhatsApp()
            } else {
                console.log("Logged out. Please delete auth_info and re-run.")
            }
        } else if (connection === "open") {
            console.log("✅ WhatsApp connected!")
        }
    })

    sock.ev.on("creds.update", saveCreds)

    // Return the socket for use in routes
    return sock
}

// Root route
app.get("/", (req, res) => {
    res.send("🚀 WhatsApp API server is running")
})

// Middleware to attach WhatsApp socket to request
app.use((req, res, next) => {
    req.whatsappSocket = sock
    next()
})

// API routes
app.use("/api/whatsapp", verifyApiKey, whatsappRoutes)

// Send message API (POST)
app.post("/send", verifyApiKey, async (req, res) => {
    try {
        const { number, message } = req.body

        if (!number || !message) {
            return res.status(400).json({ error: "number and message are required" })
        }

        // Format number (WhatsApp requires @s.whatsapp.net)
        const jid = number.includes("@s.whatsapp.net") ? number : number + "@s.whatsapp.net"

        await sock.sendMessage(jid, { text: message })

        res.json({ success: true, to: number, message })
    } catch (err) {
        console.error("❌ Error sending message:", err)
        res.status(500).json({ error: "Failed to send message" })
    }
})

// Connect to WhatsApp first, then start the server
async function startServer() {
    try {
        // Connect to WhatsApp
        await connectToWhatsApp()
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`)
            console.log(`📚 Swagger documentation available at http://localhost:${PORT}/api-docs`)
        })
    } catch (err) {
        console.error("❌ Failed to start server:", err)
        process.exit(1)
    }
}

// Start the server
startServer()
