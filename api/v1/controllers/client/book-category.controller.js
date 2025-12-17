const BookCategory = require("../../models/book-category.model");
const Book = require("../../models/book.model");
const { createTree } = require("../../../../helpers/category");
const { calculateNewPrice } = require("../../../../helpers/book");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /book-category
module.exports.getAll = async (req, res) => {
    try {
        const bookCategories = await BookCategory.find({status: "active"}).select("_id name parentId slug");
        const newbookCategories = createTree(bookCategories);
        res.json({categories: newbookCategories});
    } catch (error) {
        res.status(500).json({message: "Lỗi server!"});
    }
};

// [GET] /book-category/:slug
module.exports.getBooksByCategory = async (req, res) => {
    const slug = req.params.slug;
    const [sortKey, sortValue] = req.query.sortBy?.split("-") || [];
    const page = req.query.page;

    try {
        const category = await BookCategory.findOne({slug}).select("name");
        if(!category)   return res.status(404).json({message: "Danh mục không tồn tại!"});

        const childCategories = await BookCategory.find({parentId: category.id, status: "active"}).distinct("_id");

        const categoryIds = [
            category.id, 
            ...childCategories
        ];

        //Sắp xếp theo tiêu chí
        let sort = {};
        if(sortKey && sortValue){
            sort[sortKey] = sortValue;
        }

        //Phân trang
        const totalRecord = await Book.countDocuments({
            book_category_id: { $in: categoryIds }, 
            status: "active"
        });
        const initPagination = paginationHelper(totalRecord, page);

        const books = await Book.find({
            book_category_id: { $in: categoryIds }, 
            status: "active"
        })
        .select("title thumbnail price slug discountPercent")
        .limit(initPagination.limitRecord)
        .skip(initPagination.skip)
        .sort(sort)
        .lean();

        books.forEach(item => calculateNewPrice(item));

        res.json({
            categoryName: category.name,
            books,
            totalPage: initPagination.totalPage
        });
    } catch (error) {
        res.status(500).json({message: "Lỗi server!"});
    }
};