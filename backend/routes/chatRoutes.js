const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/chatController");
const auth = require("../middleware/authMiddleware");

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Menaxhimi i mesazheve në chat
 */

/**
 * @swagger
 * /api/chat:
 *   get:
 *     summary: Merr të gjithë mesazhet
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: Lista e mesazheve
 */
router.get("/", ctrl.getMessages);

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Dërgo një mesazh të ri
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               user:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mesazhi u dërgua
 */
router.post("/", ctrl.sendMessage);

module.exports = router;
