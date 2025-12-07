const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const bookCategoryLevel1Schema = new mongoose.Schema({
    title: String,
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

const BookCategoryLevel1 = mongoose.model('BookCategoryLevel1', bookCategoryLevel1Schema, "book_category_level1s");

module.exports = BookCategoryLevel1;
