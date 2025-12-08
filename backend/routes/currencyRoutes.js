const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/currencyController");

router.get("/", ctrl.getRates);

module.exports = router;
