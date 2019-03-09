const express = require("express");
const router = express.Router();
const Product = require("../../../models/Product");

router.get("/:supplier", (req, res) => {
    console.log(req.params);
    Product.find({ supplier: req.params.supplier }).then(product => {
        res.json(product);
    });
});

module.exports = router;
