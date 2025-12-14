const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/favoriteController");
const auth = require("../middleware/authMiddleware");

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Menaxhimi i produkteve të preferuara
 */

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: 
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e produkteve të preferuara
 */
router.get("/", ctrl.getAll);

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: 
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID e produktit që do shtohet në favorites
 *     responses:
 *       200:
 *         description: Produkti u shtua te favorites
 */
router.post("/", ctrl.add);

/**
 * @swagger
 * /api/favorites/{productId}:
 *   delete:
 *     summary: 
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID e produktit që do hiqet
 *     responses:
 *       200:
 *         description: Produkti u hoq nga favorites
 */
router.delete("/:productId", ctrl.remove);

module.exports = router;
