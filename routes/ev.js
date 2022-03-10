const express = require("express");
const router = express.Router();
const MongooseEvModel = require('../models/ev')

router.get("/", (req, res, next) => {
    MongooseEvModel.aggregate([{"$group" : {_id:"$Sales", count:{$sum:1}}}]).toArray(function(err, data) {
        if (err) res.send(err);
        res.json(data);
        db.close();
      });
    });

router.get('/ev', (req, res) => {
    MongooseEvModel.find({}, (err, data) => {
        if (err) res.send(err);
        res.json(data);
    });
});
// get single ev
router.get("/ev/:id", function(req, res, next) {
    MongooseEvModel.findById(req.params.id, (err, data) => {
        if (err) res.send(err);
        res.json(data);
    });
});
// create ev
router.post("/ev", function(req, res, next) {
    var ev= req.body;
    if (!ev.Country || !ev.Sales
        || !ev.Year)  {
        res.status(400);
        res.json(
            {"error": "Bad data, could not be inserted into the database."}
        )
    } else {
        let newev= new MongooseEvModel(ev);
        newev.save((err, data) => {
            if (err) res.send(err);
            res.json(data);
        });
    }
});
// delete ev
router.delete("/ev/:id", function(req, res, next) {
    MongooseEvModel.findOneAndRemove({ _id: req.params.id }, (err, data) => {
        if (err) res.send(err);
        res.json({ message: 'Successfully deleted ev!'});
    });
});
// edit ev
router.put("/ev/:id", function(req, res, next) {
    var ev= req.body;
    var changedev= {};
    if (ev.Country) {
        changedev.Country = ev.Country;
    }
    if (ev.Sales) {
        changedev.Sales = ev.Sales;
    }
    if (ev.Year) {
        changedev.Year = ev.Year;
    }
    if (ev.StartDate) {
        changedev.StartDate = ev.StartDate;
    }
    if (!changedev) {
        res.status(400);
        res.json({"error": "Bad Data"})        
    } else {
        MongooseEvModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, 
            (err, data) => {
                if (err) res.send(err);
                res.json(data);
            }
        );
    }
});
module.exports = router;
