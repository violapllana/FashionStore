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
 *     summary: Merr të gjitha produktet në shportë
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Lista e produkteve në shportë
 */
router.get("/", ctrl.get);
router.post("/", ctrl.add);
router.put("/:itemId", ctrl.update);
router.delete("/:itemId", ctrl.remove);

module.exports = router;
