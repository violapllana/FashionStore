const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");
const { auth } = require("../controllers/authController"); 


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autentikimi dhe menaxhimi i përdoruesve
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               name:
 *                 type: string
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
 *     summary: 
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
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

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout i suksesshëm
 */
router.post("/logout", ctrl.auth, ctrl.logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary:
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Të dhënat e përdoruesit
 */
router.get("/me", ctrl.auth, ctrl.me);

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: 
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email i verifikuar
 */
router.get("/verify", ctrl.verifyEmail);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: 
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token i ri
 */
router.post("/refresh", ctrl.refresh);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: 
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email për reset u dërgua
 */
router.post("/forgot-password", ctrl.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: 
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password u ndryshua
 */
router.post("/reset-password", ctrl.resetPassword);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: 
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e përdoruesve
 */
router.get("/users",ctrl.auth, ctrl.isAdmin, ctrl.getUsers);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   put:
 *     summary: 
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Përdoruesi u përditësua
 */
router.put("/users/:id", ctrl.auth, ctrl.isAdmin,ctrl.updateUser);

/**
 * @swagger
 * /api/auth/users/{id}:
 *   delete:
 *     summary: 
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Përdoruesi u fshi
 */
router.delete("/users/:id",ctrl.auth, ctrl.isAdmin, ctrl.deleteUser);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.get("/profile", auth, ctrl.getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update current user's profile
 *     tags: [Profile]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put("/profile", auth, ctrl.updateProfile);

router.post("/resend-verification" , ctrl.resendVerification);

module.exports = router;
