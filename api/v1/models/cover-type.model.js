const mongoose = require('mongoose');

const coverTypeSchema = new mongoose.Schema({
    name: String,
    description: String,
    position: Number,
    status: {
        type: String,
        default: "active"
    },
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

const CoverType = mongoose.model('CoverType', coverTypeSchema, "cover_types");

module.exports = CoverType;
