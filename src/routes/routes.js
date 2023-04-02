const express = require("express");
const StartVenomController = require("../controllers/StartVenomController");
const router = express.Router();

router.get("/startVenom", StartVenomController.index)

module.exports = router;