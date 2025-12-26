const Book = require("../../models/book.model");
const { calculateNewPrice } = require("../../../../helpers/book");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /books/search
module.exports.searchBook = async (req, res) => {
    const { q, page } = req.query;
    try {
        const filter = {
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        };

        const totalRecord = await Book.countDocuments(filter);
        const initPagination = paginationHelper(totalRecord, page);

        const books = await Book
            .find(filter)
            .select("title thumbnail price slug discountPercent")
            .sort({ position: -1 })
            .limit(initPagination.limitRecord)
            .skip(initPagination.skip);

        res.json({ books, totalPage: initPagination.totalPage });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// [GET] /books/featured
module.exports.getFeaturedBooks = async (req, res) => {
    try {
        const featuredBooks = await Book.find({
            featured: true,
            status: "active"
        })
            .select("title thumbnail price slug discountPercent")
            .limit(8);

        featuredBooks.forEach(item => calculateNewPrice(item));

        res.json({ featuredBooks });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// [GET] /books/sale
module.exports.getSaleBooks = async (req, res) => {
    try {
        const saleBooks = await Book.find({
            discountPercent: { $gt: 0 },
            status: "active"
        })
            .select("title thumbnail price slug discountPercent")
            .sort({ discountPercent: "desc" })
            .limit(8)
            .lean();

        saleBooks.forEach(item => calculateNewPrice(item));

        res.json({ saleBooks })
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// [GET] /books/:slug
module.exports.getBookDetail = async (req, res) => {
    const slug = req.params.slug;
    try {
        const bookDetail = await Book.findOne({ slug })
            .populate({ path: "distributor_id", select: "name" })
            .populate({ path: "publisher_id", select: "name" })
            .populate({ path: "authors_id", select: "name" })
            .populate({ path: "cover_type_id", select: "name" })
            .select("title pageCount description price size publishDate stockQuantity images discountPercent")
            .lean();

        if (!bookDetail) {
            return res.status(404).json({ message: "Sách không tồn tại!" });
        }

        calculateNewPrice(bookDetail);

        res.json({ bookDetail });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};
