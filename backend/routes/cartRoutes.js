const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/cartController");
const auth = require("../middleware/authMiddleware");

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Menaxhimi i shportës së blerjeve
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary:
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e produkteve në shportë
 */
router.get("/", ctrl.get);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: 
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produkti u shtua në shportë
 */
router.post("/", ctrl.add);

/**
 * @swagger
 * /api/cart/{itemId}:
 *   put:
 *     summary: 
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produkti u përditësua
 */
router.put("/:itemId", ctrl.update);

/**
 * @swagger
 * /api/cart/{itemId}:
 *   delete:
 *     summary: 
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produkti u fshi nga shporta
 */
router.delete("/:itemId", ctrl.remove);

module.exports = router;
