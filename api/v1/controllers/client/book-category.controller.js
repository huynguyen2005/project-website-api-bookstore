const BookCategory = require("../../models/book-category.model");
const Book = require("../../models/book.model");
const { createTree } = require("../../../../helpers/category");
const { calculateNewPrice } = require("../../../../helpers/book");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /book-categories
module.exports.getAll = async (req, res) => {
    try {
        const bookCategories = await BookCategory.find({ status: "active" }).select("_id name parentId slug");
        const newbookCategories = createTree(bookCategories);
        res.json({ categories: newbookCategories });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

