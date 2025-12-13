const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: String,
    position: Number,
    description: String,
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

const Author = mongoose.model('Author', authorSchema, "authors");

module.exports = Author;
