const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Menaxhimi i produkteve
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Merr listën e produkteve
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista e produkteve
 */
router.get("/", ctrl.list);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Merr një produkt sipas ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID e produktit
 *     responses:
 *       200:
 *         description: Produkti i marrë
 */
router.get("/:id", ctrl.getOne);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Krijo një produkt të ri (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produkti u krijua
 */
router.post("/", auth, ctrl.create);

router.put("/:id", auth, ctrl.update);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;
