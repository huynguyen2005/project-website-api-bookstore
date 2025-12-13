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
    distributor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Distributor"
    },
    publisher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Publisher"
    },
    book_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookCategory"
    },
    authors_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Author"
        }
    ],
    cover_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CoverType"
    },
    position: Number,
    status: {
        type: String,
        default: "active"
    },
    discountPercent: Number,
    slug: {
        type: String,
        slug: "title",
        unique: true
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

const Book = mongoose.model('Book', bookSchema, "books");

module.exports = Book;
