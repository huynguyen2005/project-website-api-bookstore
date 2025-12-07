const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
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

const paymentMethod = mongoose.model('paymentMethod', paymentMethodSchema, "payment_methods");

module.exports = paymentMethod;
