const express = require("express");
const router = express.Router();
const SaleModel = require('../models/sale')
/**
 * @swagger
 * components:
 *   schemas:
 *     sale:
 *       type: object
 *       required:
 *         - Country
 *         - Sales
 *         - Year
 *       properties:
 *         _id:
 *           type: string
 *           description: The Auto-generated GUID of a sale
 *         Country:
 *           type: string
 *           description: Country  of the sale
 *         Sale:
 *           type: number
 *           description: Number of sales
 *         Year:
 *           type: string
 *           descripton: Year that sales belongs to
 *        
 *       example:
 *         _id: 621d30ca0125b6c87d56c32d
 *         Country: Cambodia
 *         Sale: 10000
 *         Year: 2020
 *     
 *
 */
/**
 * @swagger
 * /api/ev:
 *  get:
 *      summary: Retrieve a list of sales
 *      tags: [sales]
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
 *                  $ref: '#/components/schemas/sale'
 *              
*/
router.get('/ev', (req, res) => {
    SaleModel.find({}, (err, data) => {
        if (err) res.send(err);
        res.json(data);
    });
});

/**
 * @swagger
 * /api/ev/{id}:
 *   get:
 *     summary: Retrieve a list of sales
 *     tags: [sales]
 *     description: Returns a single sale
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: sale's id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single sale by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/sale'
 *       400:
 *         description: post can not be found
 */

// get single ev
router.get("/ev/:id", function(req, res, next) {
    SaleModel.findById(req.params.id, (err, data) => {
        if (err) res.send(err);
        res.json(data);
    });
}); 
/**
 * @swagger
 * /api/ev:
 *   post:
 *     summary: Creates a new sale.
 *     tags: [sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/sale'
 *     responses:
 *       200:
 *         description: The sale was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/sale'
 *       500:
 *         description: Some server error
 */

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
/**
 * @swagger
 * /api/ev/{id}:
 *   delete:
 *     summary: Deletes a single sale
 *     tags: [sales]
  *     parameters:
 *       - name: id
 *         description: sale id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: sale was deleted
 *       404:
 *         description: The sale was not found
 * 
 */
// delete ev
router.delete("/ev/:id", function(req, res, next) {
    SaleModel.findOneAndRemove({ _id: req.params.id }, (err, data) => {
        if (err) res.send(err);
        res.json({ message: 'Successfully deleted ev!'});
    });
});

/**
 * @swagger
 * /api/ev/{id}:
 *   put:
 *     summary: updates sales by id
 *     tags: [sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: sale id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/sale'
 *     responses:
 *       200:
 *         decsription: The sale was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/sale'
 *       404:
 *         description: sale was not found.
 *       500:
 *         description: Some errors happend.
 *
 */
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
