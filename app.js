const express = require("express");
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

// app.get("/api/sources", sources);
// app.get("/api/:supplier", supplier);
// app.get("/api/:supplier/:category", supplierfilter);
// app.get("/api/:supplier/:category/:id", supplierfilterspecific);

var port = process.env.PORT || 3344;

// start the server
const server = app.listen(port);
console.log(`Server running on port ${port}`);

// increase the timeout to 4 minutes
server.timeout = 0;

module.exports = app;
