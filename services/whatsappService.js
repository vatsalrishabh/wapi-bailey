// services/whatsappService.js
import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";

let sock; // will store the WhatsApp connection

export async function startWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  // Show QR in terminal when login is required
  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update;
    if (qr) qrcode.generate(qr, { small: true });
    if (connection === "open") console.log("✅ WhatsApp connected!");
  });

  // Save session
  sock.ev.on("creds.update", saveCreds);
}

// Function to send OTP
export async function sendOTP(number, otp) {
  if (!sock) throw new Error("WhatsApp is not connected yet!");
  const jid = number + "@s.whatsapp.net";
  await sock.sendMessage(jid, { text: `Your OTP is: ${otp}` });
  console.log(`📩 OTP sent to ${number}: ${otp}`);
}
