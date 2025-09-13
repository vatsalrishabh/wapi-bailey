// controllers/whatsappController.js

/**
 * @function sendMessageToMultipleNumbers
 * @description Sends a message to multiple phone numbers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendMessageToMultipleNumbers = async (req, res) => {
    try {
        const { numbers, message } = req.body;

        // Validate input
        if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: "numbers array is required and must not be empty" 
            });
        }

        if (!message) {
            return res.status(400).json({ 
                success: false, 
                error: "message is required" 
            });
        }

        // Get the WhatsApp socket from the request (will be attached in middleware)
        const sock = req.whatsappSocket;
        
        if (!sock) {
            return res.status(500).json({ 
                success: false, 
                error: "WhatsApp is not connected" 
            });
        }

        // Send message to each number
        const results = [];
        
        for (const number of numbers) {
            try {
                // Format number (WhatsApp requires @s.whatsapp.net)
                const jid = number.includes("@s.whatsapp.net") ? number : number + "@s.whatsapp.net";
                
                // Send the message
                await sock.sendMessage(jid, { text: message });
                
                // Add success result
                results.push({
                    number,
                    status: "success"
                });
            } catch (err) {
                // Add failure result
                results.push({
                    number,
                    status: "failed",
                    error: err.message
                });
            }
        }

        // Return results
        res.json({
            success: true,
            message,
            results
        });
    } catch (err) {
        console.error("❌ Error sending messages:", err);
        res.status(500).json({ 
            success: false, 
            error: "Failed to send messages" 
        });
    }
};