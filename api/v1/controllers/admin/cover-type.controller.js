const CoverType = require("../../models/cover-type.model");
const searchInforHelper = require("../../../../helpers/searchInfor");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /admin/cover-types
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

        const totalRecord = await CoverType.countDocuments(find);
        const initPagination = paginationHelper(totalRecord, page);

        const allCoverType = await CoverType.find(find)
            .sort(sort)
            .limit(initPagination.limitRecord)
            .skip(initPagination.skip);

        res.json({
            coverTypes: allCoverType,
            pageTotal: initPagination.totalPage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy loại bìa thất bại!"
        });
    }
};

// [GET] /admin/cover-types/list
module.exports.getListCoverType = async (req, res) => {
    try {
        const coverTypes = await CoverType.find().select("name");
        res.json(coverTypes);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy danh sách loại bìa thất bại!"
        });
    }
}

// [GET] /admin/cover-types/:id
module.exports.getCoverType = async (req, res) => {
    const coverTypeId = req.params.id;
    try {
        const coverType = await CoverType.findById(coverTypeId)
            .populate({ path: "createdBy.account_id", select: "fullName" })
            .populate({ path: "updatedBy.account_id", select: "fullName" });
        if (!coverType) {
            return res.status(404).json({
                success: false,
                message: "Loại bìa không tồn tại!"
            });
        }
        res.json(coverType);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy loại bìa thất bại!"
        });
    }
};

// [POST] /admin/cover-types
module.exports.createCoverType = async (req, res) => {
    const data = req.body;
    try {
        if (!data.position) {
            data.position = await CoverType.countDocuments() + 1;
        }

        const createdBy = {
            account_id: req.accountId
        };
        data.createdBy = createdBy;

        const coverType = new CoverType(data);
        await coverType.save();

        res.json({
            success: true,
            message: "Thêm loại bìa thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Thêm loại bìa thất bại!"
        });
    }
};

// [PUT] /admin/cover-types/:id
module.exports.editCoverType = async (req, res) => {
    const coverTypeId = req.params.id;
    const data = req.body;

    try {
        const coverType = await CoverType.findById(coverTypeId);
        if (!coverType) {
            return res.status(404).json({
                success: false,
                message: "Loại bìa không tồn tại!"
            });
        }

        await CoverType.updateOne({ _id: coverTypeId }, {
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
            message: "Cập nhật loại bìa thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cập nhật loại bìa thất bại!"
        });
    }
};

// [DELETE] /admin/cover-types/:id
module.exports.deleteCoverType = async (req, res) => {
    const coverTypeId = req.params.id;

    try {
        const coverType = await CoverType.findById(coverTypeId);
        if (!coverType) {
            return res.status(404).json({
                success: false,
                message: "Loại bìa không tồn tại!"
            });
        }

        await CoverType.deleteOne({ _id: coverTypeId });
        res.json({
            success: true,
            message: "Xóa loại bìa thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Xóa loại bìa thất bại!"
        });
    }
};

// [DELETE] /admin/cover-types
module.exports.deleteManyCoverType = async (req, res) => {
    const { ids } = req.body;
    try {
        await CoverType.deleteMany({ _id: { $in: ids } });
        res.json({
            success: true,
            message: "Xóa loại bìa thành công!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Xóa loại bìa thất bại!"
        });
    }
};