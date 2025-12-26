const Distributor = require("../../models/distributor.model");
const searchInforHelper = require("../../../../helpers/searchInfor");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /admin/distributors
module.exports.index = async (req, res) => {
    const page = req.query.page;
    const keyword = req.query.keyword;
    const status = req.query.status;
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    const find = {};
    const sort = {};
    try {
        if (keyword) {
            const objectSearch = searchInforHelper(keyword);
            find.name = objectSearch.regex;
        }

        if (status) {
            find.status = status;
        }

        if (sortKey && sortValue) {
            sort[sortKey] = sortValue;
        }

        const totalRecord = await Distributor.countDocuments(find);
        const initPagination = paginationHelper(totalRecord, page);

        const allDistributor = await Distributor.find(find)
            .sort(sort)
            .limit(initPagination.limitRecord)
            .skip(initPagination.skip);

        res.json({
            distributors: allDistributor,
            pageTotal: initPagination.totalPage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy nhà phân phối thất bại!"
        });
    }
};

// [GET] /admin/distributors/list
module.exports.getListDistributor = async (req, res) => {
    try {
        const distributors = await Distributor.find().select("id name");
        res.json(distributors);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy danh sách nhà phân phối thất bại!"
        });
    }
}

// [GET] /admin/distributors/:id
module.exports.getDistributor = async (req, res) => {
    const DistributorId = req.params.id;
    try {
        const distributor = await Distributor.findById(DistributorId);
        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Nhà phân phối không tồn tại!"
            });
        }
        res.json(distributor);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy nhà phân phối thất bại!"
        });
    }
};

// [POST] /admin/distributors
module.exports.createDistributor = async (req, res) => {
    const data = req.body;
    try {
        if (!data.position) {
            data.position = await Distributor.countDocuments() + 1;
        }

        const createdBy = {
            account_id: req.accountId
        };
        data.createdBy = createdBy;

        const distributor = new Distributor(data);
        await distributor.save();
        res.json({
            success: true,
            message: "Thêm nhà phân phối thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Thêm nhà phân phối thất bại!"
        });
    }
};

// [PUT] /admin/distributors/:id
module.exports.editDistributor = async (req, res) => {
    const distributorId = req.params.id;
    const data = req.body;
    try {
        const distributor = await Distributor.findById(distributorId);
        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Nhà phân phối không tồn tại!"
            });
        }

        await Distributor.updateOne({ _id: distributorId }, {
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
            message: "Cập nhật nhà phân phối thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cập nhật nhà phân phối thất bại!"
        });
    }
};

// [DELETE] /admin/distributors/:id
module.exports.deleteDistributor = async (req, res) => {
    const distributorId = req.params.id;
    try {
        const distributor = await Distributor.findById(distributorId);
        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Nhà phân phối không tồn tại!"
            });
        }

        await Distributor.deleteOne({ _id: distributorId });
        res.json({
            success: true,
            message: "Xóa nhà phân phối thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Xóa nhà phân phối thất bại!"
        });
    }
};
