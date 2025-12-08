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

const Role = mongoose.model('Role', roleSchema, "role"); 

module.exports = Role;