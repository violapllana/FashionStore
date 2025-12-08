const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userController");
const auth = require("../controllers/authController").auth;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API për përdoruesit
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Merr të gjithë përdoruesit
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e përdoruesve
 *       401:
 *         description: Nuk ka autorizim
 */
router.get("/", auth, userCtrl.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Merr përdorues sipas ID
 *     tags: [Users]
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
 *         description: Përdoruesi gjendet
 *       404:
 *         description: User not found
 */
router.get("/:id", auth, userCtrl.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Editon një përdorues
 *     tags: [Users]
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
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Përdoruesi u editua
 *       404:
 *         description: User not found
 */
router.put("/:id", auth, userCtrl.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Fshin një përdorues
 *     tags: [Users]
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
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete("/:id", auth, userCtrl.deleteUser);

module.exports = router;
