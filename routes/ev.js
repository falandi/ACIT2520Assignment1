const express = require("express");
const router = express.Router();
const SaleModel = require('../models/sale')

// router.get("/chart", (req, res, next) => {
//     sql = "SELECT School as school, COUNT(*) as count";
//     sql += " FROM students GROUP BY School";

//     var params = []
//     db.all(sql, params, (err, rows) => {
//         if (err) {
//           res.status(400).json({"error":err.message});
//           return;
//         }
//         res.json(rows)
//       });
// });

/**
 * @swagger
 * /api/ev:
 *  get:
 *      summary: Retrieve a list of sales
 *      tags: [Sales]
 *      description: Used to request all sales
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: A successful response
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Sale'
*/
router.get('/ev', (req, res) => {
    SaleModel.find({}, (err, data) => {
        if (err) res.send(err);
        res.json(data);
    });
});
// get single ev
router.get("/ev/:id", function(req, res, next) {
    SaleModel.findById(req.params.id, (err, data) => {
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
        let newev= new SaleModel(ev);
        newev.save((err, data) => {
            if (err) res.send(err);
            res.json(data);
        });
    }
});
// delete ev
router.delete("/ev/:id", function(req, res, next) {
    SaleModel.findOneAndRemove({ _id: req.params.id }, (err, data) => {
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
        SaleModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, 
            (err, data) => {
                if (err) res.send(err);
                res.json(data);
            }
        );
    }
});
module.exports = router;
