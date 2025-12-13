const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: String,
    description: String,
    position: Number,
    permissions: {
        type: Array,
        default: []
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

const Role = mongoose.model('Role', roleSchema, "role");

module.exports = Role;