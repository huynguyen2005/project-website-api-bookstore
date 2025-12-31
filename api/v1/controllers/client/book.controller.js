const Book = require("../../models/book.model");
const BookCategory = require("../../models/book-category.model");
const Distributor = require("../../models/distributor.model");
const { calculateNewPrice } = require("../../../../helpers/book");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /books/
module.exports.index = async (req, res) => {
    const { page } = req.query;
    const [sortKey, sortValue] = req.query.sortBy?.split("-") || [];
    let find = { status: "active" };
    try {
        if (req.query.q) {
            find.$or = [
                { title: { $regex: req.query.q, $options: 'i' } },
                { description: { $regex: req.query.q, $options: 'i' } }
            ];
        }

        if (req.query.category) {
            const categorySlug  = req.query.category;

            const category = await BookCategory.findOne({ slug: categorySlug }).select("_id");
            if (!category) return res.status(404).json({ message: "Danh mục không tồn tại!" });

            const childCategories = await BookCategory.find({ parentId: category.id, status: "active" }).distinct("_id");

            const categoryIds = [
                category.id,
                ...childCategories
            ];

            find.book_category_id = { $in: categoryIds };
        }

        if (req.query.distributor) {
            const distributorSlug  = req.query.distributor;

            const distributor = await Distributor.findOne({ slug: distributorSlug  }).select("_id");
            if (!distributor) return res.status(404).json({ message: "Nhà phân phối không tồn tại!" });
            find.distributor_id = distributor.id;
        }

        const totalRecord = await Book.countDocuments(find);
        const initPagination = paginationHelper(totalRecord, page);

        let sort = { position: -1 };
        if (sortKey && sortValue) {
            sort[sortKey] = sortValue;
        }

        const books = await Book
            .find(find)
            .select("title thumbnail price slug discountPercent")
            .sort(sort)
            .limit(initPagination.limitRecord)
            .skip(initPagination.skip)
            .lean();

        books.forEach(item => {
            item.newPrice = calculateNewPrice(item);
        });

        res.json({ 
            books, 
            totalPage: initPagination.totalPage 
        });
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
            .limit(8)
            .lean();

        featuredBooks.forEach(item => {
            item.newPrice = calculateNewPrice(item);
        });

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

        saleBooks.forEach(item => {
            item.newPrice = calculateNewPrice(item);
        });

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
