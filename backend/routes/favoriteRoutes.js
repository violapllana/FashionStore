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
 *     summary: Merr të gjitha produktet e preferuara të përdoruesit
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: Lista e produkteve të preferuara
 */
router.get("/", ctrl.getAll);

router.post("/", ctrl.add);
router.delete("/:productId", ctrl.remove);

module.exports = router;
