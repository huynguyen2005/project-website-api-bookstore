const Carrier = require("../../models/carrier.model");
const searchInforHelper = require("../../../../helpers/searchInfor");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /admin/carrier
module.exports.index = async (req, res) => {
    const page = req.query.page;
    const keyword = req.query.keyword;
    const status = req.query.status;
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    const find = {};
    const sort = {};
    try {
        // Phân trang
        const totalRecord = await Carrier.countDocuments(find);
        const initPagination = paginationHelper(totalRecord, page);

        // Tìm kiếm
        if (keyword) {
            const objectSearch = searchInforHelper(keyword);
            find.name = objectSearch.regex;
        }

        // Lọc theo trạng thái
        if (status) {
            find.status = status;
        }

        // Sắp xếp theo tiêu chí
        if (sortKey && sortValue) {
            sort[sortKey] = sortValue;
        }

        const allCarrier = await Carrier.find(find)
            .sort(sort)
            .limit(initPagination.limitRecord)
            .skip(initPagination.skip);

        if (allCarrier.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn vị vận chuyển!"
            });
        }

        res.json({
            carriers: allCarrier,
            pageTotal: initPagination.totalPage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy đơn vị vận chuyển thất bại!"
        });
    }
};

// [GET] /admin/carrier/all
module.exports.getAll = async (req, res) => {
    try {
        const carriers = await Carrier.find().select("id name");
        res.json(carriers);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy đơn vị vận chuyển thất bại!"
        });
    }
};

// [GET] /admin/carrier/:id
module.exports.getCarrier = async (req, res) => {
    const carrierId = req.params.id;
    try {
        const carrier = await Carrier.findById(carrierId);
        if (!carrier) {
            return res.status(404).json({
                success: false,
                message: "Đơn vị vận chuyển không tồn tại!"
            });
        }
        res.json(carrier);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy đơn vị vận chuyển thất bại!"
        });
    }
};

// [POST] /admin/carrier/create
module.exports.createCarrier = async (req, res) => {
    const data = req.body;
    try {
        if(!data.position){
            data.position = await Carrier.countDocuments() + 1;
        }
        const carrier = new Carrier(data);
        await carrier.save();
        res.json({
            success: true,
            message: "Thêm đơn vị vận chuyển thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Thêm đơn vị vận chuyển thất bại!"
        });
    }
};

// [PUT] /admin/carrier/edit/:id
module.exports.editCarrier = async (req, res) => {
    const carrierId = req.params.id;
    const data = req.body;
    try {
        const carrier = await Carrier.findById(carrierId);
        if (!carrier) {
            return res.status(404).json({
                success: false,
                message: "Đơn vị vận chuyển không tồn tại!"
            });
        }

        await Carrier.updateOne({ _id: carrierId }, data);
        res.json({
            success: true,
            message: "Cập nhật đơn vị vận chuyển thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cập nhật đơn vị vận chuyển thất bại!"
        });
    }
};

// [DELETE] /admin/carrier/delete/:id
module.exports.deleteCarrier = async (req, res) => {
    const carrierId = req.params.id;
    try {
        const carrier = await Carrier.findById(carrierId);
        if (!carrier) {
            return res.status(404).json({
                success: false,
                message: "Đơn vị vận chuyển không tồn tại!"
            });
        }

        await Carrier.deleteOne({ _id: carrierId });
        res.json({
            success: true,
            message: "Xóa đơn vị vận chuyển thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Xóa đơn vị vận chuyển thất bại!"
        });
    }
};
