const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new Schema({
    Country: {
        type: String,
        required: true
    },
    Sales: {
        type: Number,
        required: true
    },
    Year: {
        type: Number,
        required: true
    }
});
module.exports = mongoose.model("Sale", saleSchema);