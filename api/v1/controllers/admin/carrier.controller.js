const Carrier = require("../../models/carrier.model");
const searchInforHelper = require("../../../../helpers/searchInfor");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /admin/carriers
module.exports.index = async (req, res) => {
    const page = req.query.page;
    const keyword = req.query.keyword;
    const status = req.query.status;
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    const find = {};
    const sort = {};
    try {
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

        // Phân trang
        const totalRecord = await Carrier.countDocuments(find);
        const initPagination = paginationHelper(totalRecord, page);

        const allCarrier = await Carrier.find(find)
            .sort(sort)
            .limit(initPagination.limitRecord)
            .skip(initPagination.skip);

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

// [GET] /admin/carriers/:id
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

// [POST] /admin/carriers
module.exports.createCarrier = async (req, res) => {
    const data = req.body;
    try {
        if(!data.position){
            data.position = await Carrier.countDocuments() + 1;
        }

        const createdBy = {
            account_id: req.accountId
        };
        data.createdBy = createdBy;

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

// [PUT] /admin/carriers/:id
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

        await Carrier.updateOne({ _id: carrierId }, {
            ...data,
            $push: {
                updatedBy: {
                    account_id: req.accountId,
                    updatedAt: Date.now()
                }
            }
        });
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

// [DELETE] /admin/carriers/:id
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
