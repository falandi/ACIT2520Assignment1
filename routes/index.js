// chart goes here 
var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
    res.render("index", { title: "EXPRESS MONGO" })
});
module.exports = router;