const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const index = require("./routes");
const ev = require("./routes/ev");

const config = require('./config');

const app = express();



mongoose.connect(`mongodb://${config.database_server}:${config.database_port}/ev`,
function (err) {
    if (err) throw err;
   console.log(`Successfully connected to database server ${config.database_server}:${config.database_port} `);
});

// View engine
var ejsEngine = require("ejs-locals");
app.engine("ejs", ejsEngine);           // support master pages
app.set("view engine", "ejs");          // ejs view engine
// Set static folder
app.use(express.static(path.join(__dirname, "clients")));
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/", index);
app.use("/api", ev);
app.listen(config.http_port, function() {
    console.log(`Server started on port: ${config.http_port}`);
    console.log(`Using mongo database on server ${config.database_server}:${config.database_port}`);
});
