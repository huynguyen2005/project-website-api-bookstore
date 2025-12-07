const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const bookCategoryLevel2Schema = new mongoose.Schema({
    title: String,
    book_category_level1: String,
    slug: { 
        type: String, 
        slug: "title", 
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

const BookCategoryLevel2 = mongoose.model('BookCategoryLevel2', bookCategoryLevel2Schema, "book_category_level2s");

module.exports = BookCategoryLevel2;
