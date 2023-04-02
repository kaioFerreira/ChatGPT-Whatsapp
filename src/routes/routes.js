const express = require("express");
const StartVenomController = require("../controllers/StartVenomController");
const router = express.Router();

router.get("/startVenom", StartVenomController.index)
router.get("/", StartVenomController.create)

module.exports = router;