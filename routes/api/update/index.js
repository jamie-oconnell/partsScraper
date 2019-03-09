const express = require("express");
const router = express.Router();
const getHitechPartsData = require("../../../functions/ScrapeHitechParts");

router.get("/:supplier", (req, res) => {
    getHitechPartsData();
});

module.exports = router;
