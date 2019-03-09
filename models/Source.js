const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SourceSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    valueparts_url: {
        type: String
    },
    hitechparts_url: {
        type: String
    },
    mobilehq_url: {
        type: String
    },
    jstech_url: {
        type: Object
    }
});

module.exports = Source = mongoose.model("source", SourceSchema);
