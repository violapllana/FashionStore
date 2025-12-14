const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/orderController");
const auth = require("../middleware/authMiddleware");

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Menaxhimi i porosive
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Merr të gjitha porositë e përdoruesit
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e porosive
 */
router.get("/", ctrl.getOrders);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Krijo një porosi të re
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Porosia u krijua
 */
router.post("/", ctrl.createOrder);

/**
 * @swagger
 * /api/orders/{orderId}:
 *   put:
 *     summary: Përditëso statusin e porosisë
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, completed, canceled]
 *     responses:
 *       200:
 *         description: Statusi u përditësua
 */
router.put("/:orderId", ctrl.updateOrderStatus);

/**
 * @swagger
 * /api/orders/{orderId}:
 *   delete:
 *     summary: Fshi një porosi
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Porosia u fshi
 */
router.delete("/:orderId", ctrl.deleteOrder);

module.exports = router;
