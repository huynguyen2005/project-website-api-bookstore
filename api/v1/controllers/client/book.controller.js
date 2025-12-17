const Book = require("../../models/book.model");
const { calculateNewPrice } = require("../../../../helpers/book");

// [GET] /book/featured
module.exports.getFeaturedBooks = async (req, res) => {
    try {
        const featuredBooks = await Book.find({
            featured: true, 
            status: "active"
        })
        .select("title thumbnail price slug discountPercent")
        .limit(8);
        
        featuredBooks.forEach(item => calculateNewPrice(item));

        res.json({featuredBooks})
    } catch (error) {
        res.status(500).json({message: "Lỗi server!"});
    }
};

// [GET] /book/sale
module.exports.getSaleBooks = async (req, res) => {
    try {
        const saleBooks = await Book.find({
            discountPercent: { $gt: 0 },
            status: "active"
        })
        .select("title thumbnail price slug discountPercent")
        .sort({discountPercent: "desc"})
        .limit(8)
        .lean();
        
        saleBooks.forEach(item => calculateNewPrice(item)); 

        res.json({saleBooks})
    } catch (error) {
        res.status(500).json({message: "Lỗi server!"});
    }
};

// [GET] /book/:slug
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
