const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const authorSchema = new mongoose.Schema({
    name: String,
    age: Number, 
    gender: String,
    slug: { 
        type: String, 
        slug: "name", 
        unique: true
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

const Author = mongoose.model('Author', authorSchema, "authors");

module.exports = Author;
