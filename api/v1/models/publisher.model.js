const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const publisherSchema = new mongoose.Schema({
    name: String,
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

const Publisher = mongoose.model('Publisher', publisherSchema, "publishers");

module.exports = Publisher;
