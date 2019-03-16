const express = require("express");
const router = express.Router();
const getHitechPartsData = require("../../../functions/ScrapeHitechParts");
const getValuepartsData = require("../../../functions/ScrapeValueParts");

router.get("/:supplier", async (req, res) => {
    switch (req.params.supplier) {
        case "hitechparts":
            console.log("\n");
            await getHitechPartsData();
            res.json({ msg: "Scraping complete!" });
            console.log("\n");
        // case "valueparts":
        //     getValuepartsData();
    }
});

module.exports = router;
