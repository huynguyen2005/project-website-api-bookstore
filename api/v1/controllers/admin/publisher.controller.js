const Publisher = require("../../models/publisher.model");
const searchInforHelper = require("../../../../helpers/searchInfor");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /admin/publishers
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
        const totalRecord = await Publisher.countDocuments(find);
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

        const allPublisher = await Publisher.find(find)
            .sort(sort)
            .limit(initPagination.limitRecord)
            .skip(initPagination.skip);

        if (allPublisher.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhà xuất bản!"
            });
        }

        res.json({
            publishers: allPublisher,
            pageTotal: initPagination.totalPage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy nhà xuất bản thất bại!"
        });
    }
};

// [GET] /admin/publishers/list
module.exports.getListPublisher = async (req, res) => {
    try {
        const publishers = await Publisher.find().select("id name");
        res.json(publishers);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy danh sách nhà xuất bản thất bại!"
        });
    }
}

// [GET] /admin/publishers/:id
module.exports.getPublisher = async (req, res) => {
    const publisherId = req.params.id;
    try {
        const publisher = await Publisher.findById(publisherId);
        if (!publisher) {
            return res.status(404).json({
                success: false,
                message: "Nhà xuất bản không tồn tại!"
            });
        }
        res.json(publisher);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy nhà xuất bản thất bại!"
        });
    }
};

// [POST] /admin/publishers
module.exports.createPublisher = async (req, res) => {
    const data = req.body;
    try {
        if (!data.position) {
            data.position = await Publisher.countDocuments() + 1;
        }

        const createdBy = {
            account_id: req.accountId
        };
        data.createdBy = createdBy;

        const publisher = new Publisher(data);
        await publisher.save();
        res.json({
            success: true,
            message: "Thêm nhà xuất bản thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Thêm nhà xuất bản thất bại!"
        });
    }
};

// [PUT] /admin/publishers/:id
module.exports.editPublisher = async (req, res) => {
    const publisherId = req.params.id;
    const data = req.body;
    try {
        const publisher = await Publisher.findById(publisherId);
        if (!publisher) {
            return res.status(404).json({
                success: false,
                message: "Nhà xuất bản không tồn tại!"
            });
        }

        await Publisher.updateOne({ _id: publisherId }, {
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
            message: "Cập nhật nhà xuất bản thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cập nhật nhà xuất bản thất bại!"
        });
    }
};

// [DELETE] /admin/publishers/:id
module.exports.deletePublisher = async (req, res) => {
    const publisherId = req.params.id;
    try {
        const publisher = await Publisher.findById(publisherId);
        if (!publisher) {
            return res.status(404).json({
                success: false,
                message: "Nhà xuất bản không tồn tại!"
            });
        }

        await Publisher.deleteOne({ _id: publisherId });
        res.json({
            success: true,
            message: "Xóa nhà xuất bản thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Xóa nhà xuất bản thất bại!"
        });
    }
};
