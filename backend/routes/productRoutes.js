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
 *     summary: 
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
 *     summary: 
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID e produktit
 *     responses:
 *       200:
 *         description: Produkti i marrë
 *       404:
 *         description: Produkti nuk u gjet
 */
router.get("/:id", ctrl.getOne);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: 
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: string
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Produkti u krijua me sukses
 *       400:
 *         description: Të dhëna të pavlefshme
 */
router.post("/", auth, ctrl.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: 
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID e produktit për t'u përditësuar
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
 *               category:
 *                 type: string
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: string
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Produkti u përditësua me sukses
 *       404:
 *         description: Produkti nuk u gjet
 */
router.put("/:id", auth, ctrl.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: 
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID e produktit për t'u fshirë
 *     responses:
 *       200:
 *         description: Produkti u fshi me sukses
 *       404:
 *         description: Produkti nuk u gjet
 */
router.delete("/:id", auth, ctrl.remove);

module.exports = router;
