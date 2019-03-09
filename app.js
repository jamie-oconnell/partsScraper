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

const supplierapi = require("./routes/api/supplier");
const updateapi = require("./routes/api/update");

app.use("/api/supplier", supplierapi);
app.use("/api/update", updateapi);

// const model = require("./models");
// app.get("/api/update", model.update);
// app.get("/api/update/:supplier", model.update);
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
