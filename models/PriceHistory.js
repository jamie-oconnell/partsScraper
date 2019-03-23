const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PriceHistorySchema = new Schema({
    url_hash: {
        type: String
    },
    product_name: {
        type: String
    },
    priceHistory: [
        {
            date: { type: Date },
            price: { type: String }
        }
    ]
});

module.exports = PriceHistory = mongoose.model(
    "priceHistory",
    PriceHistorySchema
);
