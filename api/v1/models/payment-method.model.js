const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const paymentMethodSchema = new mongoose.Schema({
    name: String,
    description: String,
    thumbnail: String,
    slug: {
        type: String,
        slug: "name",
        unique: true
    },
    status: {
        type: String,
        default: "active"
    },
    position: Number,
    createdBy: {
        account_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account"
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    updatedBy: [
        {
            account_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Account"
            },
            updatedAt: Date
        }
    ]
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema, "payment_methods");

module.exports = PaymentMethod;
