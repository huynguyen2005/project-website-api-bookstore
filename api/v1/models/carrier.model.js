const mongoose = require('mongoose');

const carrierSchema = new mongoose.Schema({
    name: String,
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date
        }
    ]
});

const Carrier = mongoose.model('Carrier', carrierSchema, "carriers");

module.exports = Carrier;
