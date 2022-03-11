const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const index = require("./routes");
const ev = require("./routes/ev");
const csvtojson = require('csvtojson')
const config = require('./config');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const SaleModel = require('./models/sale')
// const MyModel = mongoose.model('SaleSchema', SaleModel.saleSchema);

swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Ev API',
        description: 'Ev API information',
        contact: {
            name: "Faith Alandi, Ajay Sahota, Tom Nguyen"
        },
        version: '1.0.0',
        servers: [
            {
                url: "http://localhost:8888",
                description: "Development Server"
            }
        ]
    }
}

const swaggerOptions = {
    swaggerDefinition,
    apis: ['routes/*.js']
}

const swaggerSpec = swaggerJsDoc(swaggerOptions);

const app = express();



mongoose.connect(`mongodb://${config.database_server}:${config.database_port}/ev`,
function (err) {
    if (err) throw err;
   console.log(`Successfully connected to database server ${config.database_server}:${config.database_port} `);
});

//if conditional here 
SaleModel.countDocuments({}, function (err, count) {
    if(count == 0){
        const filename = path.join(__dirname, "./data/ev_sales_2020.csv")
        csvtojson().fromFile(filename)
            .then(data => {
                SaleModel.insertMany(data)
    })

    }
});


// View engine
var ejsEngine = require("ejs-locals");
const { db } = require("./models/sale");
app.engine("ejs", ejsEngine);           // support master pages
app.set("view engine", "ejs");          // ejs view engine
// Set static folder
app.use(express.static(path.join(__dirname, "clients")));
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", index);
app.use("/api", ev);
app.listen(config.http_port, function() {
    console.log(`Server started on port: ${config.http_port}`);
    console.log(`Using mongo database on server ${config.database_server}:${config.database_port}`);
});
