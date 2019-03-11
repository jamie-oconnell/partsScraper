const express = require("express");

// Connect to MonogDB
const mongoose = require("mongoose");

const db = require("./config/keys").mongoURI;

mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => {
        console.log(err);
    });

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

const productsapi = require("./routes/api/products");
const updateapi = require("./routes/api/update");

app.use("/api/products", productsapi);
app.use("/api/update", updateapi);

var port = process.env.PORT || 3344;

// Start Server
const server = app.listen(port);
console.log(`Server running on port ${port}`);

module.exports = app;
