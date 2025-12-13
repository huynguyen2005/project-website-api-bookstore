const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const bookCategorySchema = new mongoose.Schema({
    name: String,
    slug: {
        type: String,
        slug: "name",
        unique: true
    },
    parentId: {
        type: String,
        default: ""
    },
    description: String,
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

const BookCategory = mongoose.model('BookCategory', bookCategorySchema, "book_category");

module.exports = BookCategory;
