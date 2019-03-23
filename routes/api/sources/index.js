// const express = require("express");
// const router = express.Router();
// const Product = require("../../../models/Product");

// router.get("/", (req, res) => {
//     console.log(req.query);
//     Product.find({
//         $or:[
//         {supplier: req.query.supplier},
//         {product_category: req.query.category},
//         {url_hash: req.query.hash}]
//     }).then(product => {
//         res.json(product);
//     });
// });

// module.exports = router;
