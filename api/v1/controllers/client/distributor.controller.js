const Distributor = require("../../models/distributor.model");
const Book = require("../../models/book.model");
const { calculateNewPrice } = require("../../../../helpers/book");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /distributors
module.exports.getAll = async (req, res) => {
    try {
        const distributors = await Distributor.find({status: "active"}).select("slug name");
        res.json(distributors);
    } catch (error) {
        res.status(500).json({message: "Lỗi server!"});
    }
};

// [GET] /distributors/:slug
module.exports.getBooksByDistributor = async (req, res) => {
    const slug = req.params.slug;
    const [sortKey, sortValue] = req.query.sortBy?.split("-") || [];
    const page = req.query.page;

    try {
        const distributor = await Distributor.findOne({slug}).select("name");
        if(!distributor)   return res.status(404).json({message: "Nhà cung cấp không tồn tại!"});

        //Sắp xếp theo tiêu chí
        let sort = {};
        if(sortKey && sortValue){
            sort[sortKey] = sortValue;
        }
        
        //Phân trang
        const totalRecord = await Book.countDocuments({
            distributor_id: distributor.id, 
            status: "active"
        });
        const initPagination = paginationHelper(totalRecord, page);

        const books = await Book.find({
            distributor_id: distributor.id, 
            status: "active"
        })
        .select("title thumbnail price slug discountPercent")
        .limit(initPagination.limitRecord)
        .skip(initPagination.skip)
        .sort(sort)
        .lean();

        books.forEach(item => calculateNewPrice(item));

        res.json({
            distributorName: distributor.name,
            books,
            totalPage: initPagination.totalPage
        });
    } catch (error) {
        res.status(500).json({message: "Lỗi server!"});
    }
};