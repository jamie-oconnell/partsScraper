const express = require("express");
const router = express.Router();
const getHitechPartsData = require("../../../functions/ScrapeHitechParts");
const getValuepartsData = require("../../../functions/ScrapeValueParts");
const getMobileHQData = require("../../../functions/ScrapeMobileHQ");
const getJsTechData = require("../../../functions/ScrapeJSTech");

router.get("/:supplier", async (req, res) => {
    console.log("\n");
    switch (req.params.supplier) {
        case "hitechparts":
            await getHitechPartsData();
            break;
        case "valueparts":
            await getValuepartsData();
            break;
        case "mobilehq":
            await getMobileHQData();
            break;
        case "jstech":
            await getJsTechData();
            break;
    }
    res.json({ msg: "Scraping complete!" });
    console.log("\n");
});

module.exports = router;
