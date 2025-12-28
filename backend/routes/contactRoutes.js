const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/contactController");
const { auth, isAdmin } = require("../controllers/authController"); 


// Routes
router.get("/", auth, isAdmin, ctrl.getAll);
router.get("/:id", auth, isAdmin, ctrl.getOne);
router.post("/", ctrl.create);
router.put("/:id", auth, isAdmin, ctrl.update);
router.delete("/:id", auth, isAdmin, ctrl.remove);

module.exports = router;
