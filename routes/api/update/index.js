const express = require("express");
const router = express.Router();
const getHitechPartsData = require("../../../functions/ScrapeHitechParts");
const getValuepartsData = require("../../../functions/ScrapeValueParts");

router.get("/:supplier", (req, res) => {
    switch (req.params.supplier) {
        case "hitechparts":
            getHitechPartsData();
        case "valueparts":
            getValuepartsData();
    }
});

module.exports = router;
