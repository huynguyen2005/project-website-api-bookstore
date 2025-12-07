const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const bookSchema = new mongoose.Schema({
    title: String,
    pageCount: Number,
    description: String,
    featured: Boolean,
    price: Number,
    size: String,
    publishDate: Date,
    stockQuantity: Number,
    images: [String],
    thumbnail: String,
    publisher_id: String,
    distributor_id: String,
    book_category_level2_id: String,
    position: Number,
    status: String,
    discountPercent: Number,
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

const Book = mongoose.model('Book', bookSchema, "books");

module.exports = Book;
