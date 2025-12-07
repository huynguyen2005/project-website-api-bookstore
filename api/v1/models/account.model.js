const mongoose = require('mongoose');
const generate = require('../../../helpers/generate');

const accountSchema = new mongoose.Schema({
    email: String,
    fullName: String,
    password: String,
    token: {
        type: String,
        default: generate.generateRandomString(20)
    },
    phone: String,
    address: String,
    birthday: String,
    avatar: String,
    role_id: String,
    status: String,
    deleted: {
        type: Boolean,
        default: false
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
    ],
}); 

const Account = mongoose.model('Account', accountSchema, "accounts"); 

module.exports = Account;