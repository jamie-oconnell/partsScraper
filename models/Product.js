const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    product_name: {
        type: String
    },
    current_price: {
        type: String
    },
    product_url: {
        type: String
    },
    product_category: {
        type: String
    },
    supplier: {
        type: String
        // required : true
    }
});

module.exports = Product = mongoose.model("product", ProductSchema);
