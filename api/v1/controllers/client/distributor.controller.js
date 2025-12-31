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
