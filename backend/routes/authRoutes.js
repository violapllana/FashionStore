const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Menaxhimi i përdoruesve
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Regjistrimi i një përdoruesi të ri
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Përdoruesi u regjistrua me sukses
 */
router.post("/register", ctrl.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login i përdoruesit
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login i suksesshëm
 */
router.post("/login", ctrl.login);

router.get("/verify", ctrl.verifyEmail);
router.post("/refresh", ctrl.refresh);
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password", ctrl.resetPassword);

module.exports = router;
