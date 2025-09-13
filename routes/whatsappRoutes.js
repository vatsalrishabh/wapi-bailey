// routes/whatsappRoutes.js
import express from 'express';
import { sendMessageToMultipleNumbers } from '../controllers/whatsappController.js';

const router = express.Router();

/**
 * @swagger
 * /api/whatsapp/send-bulk:
 *   post:
 *     summary: Send a message to multiple WhatsApp numbers
 *     tags: [WhatsApp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numbers
 *               - message
 *             properties:
 *               numbers:
 *                 type: array
 *                 description: Array of phone numbers to send the message to
 *                 items:
 *                   type: string
 *                   example: '919876543210'
 *               message:
 *                 type: string
 *                 description: The message to send
 *                 example: 'Hello from WhatsApp API!'
 *     responses:
 *       200:
 *         description: Messages sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Hello from WhatsApp API!'
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       number:
 *                         type: string
 *                         example: '919876543210'
 *                       status:
 *                         type: string
 *                         example: 'success'
 *       400:
 *         description: Invalid input parameters
 *       500:
 *         description: Server error
 */
router.post('/send-bulk', sendMessageToMultipleNumbers);

export default router;