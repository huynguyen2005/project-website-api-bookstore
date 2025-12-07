const mongoose = require('mongoose');

const bookAuthorSchema = new mongoose.Schema(
    {
        author_id: String,
        book_id: String
    },
    {
        timestamps: true
    }
);

const BookAuthor = mongoose.model('BookAuthor', bookAuthorSchema, "book_authors");

module.exports = BookAuthor;
