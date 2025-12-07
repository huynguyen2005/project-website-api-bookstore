const mongoose = require('mongoose');
const generate = require('../../../helpers/generate');

const userSchema = new mongoose.Schema({
    email: String,
    fullName: String,
    password: String,
    token: {
        type: String,
        default: generate.generateRandomString(20)
    },
    phone: String,
    avatar: String,
    address: String,
    birthday: String,
    status: {
        type: String,
        default: "active"
    }
}, {
    timestamps: true
}); 

const User = mongoose.model('User', userSchema, "users"); 


module.exports = User;