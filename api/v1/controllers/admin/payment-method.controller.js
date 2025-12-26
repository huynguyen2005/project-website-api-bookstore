const PaymentMethod = require("../../models/payment-method.model");
const searchInforHelper = require("../../../../helpers/searchInfor");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /admin/payment-methods
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
        const totalRecord = await PaymentMethod.countDocuments(find);
        const initPagination = paginationHelper(totalRecord, page);

        const allPaymentMethod = await PaymentMethod.find(find)
            .sort(sort)
            .limit(initPagination.limitRecord)
            .skip(initPagination.skip);

        res.json({
            paymentMethods: allPaymentMethod,
            pageTotal: initPagination.totalPage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy phương thức thanh toán thất bại!"
        });
    }
};

// [GET] /admin/payment-methods/:id
module.exports.getPaymentMethod = async (req, res) => {
    const paymentMethodId = req.params.id;
    try {
        const paymentMethod = await PaymentMethod.findById(paymentMethodId);
        if (!paymentMethod) {
            return res.status(404).json({
                success: false,
                message: "Phương thức thanh toán không tồn tại!"
            });
        }
        res.json(paymentMethod);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy phương thức thanh toán thất bại!"
        });
    }
};

// [POST] /admin/payment-methods
module.exports.createPaymentMethod = async (req, res) => {
    const data = req.body;
    try {
        if (!data.position) {
            data.position = await PaymentMethod.countDocuments() + 1;
        }

        const createdBy = {
            account_id: req.accountId
        };
        data.createdBy = createdBy;

        const paymentMethod = new PaymentMethod(data);
        await paymentMethod.save();
        res.json({
            success: true,
            message: "Thêm phương thức thanh toán thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Thêm phương thức thanh toán thất bại!"
        });
    }
};

// [PUT] /admin/payment-methods/:id
module.exports.editPaymentMethod = async (req, res) => {
    const paymentMethodId = req.params.id;
    const data = req.body;
    try {
        const paymentMethod = await PaymentMethod.findById(paymentMethodId);
        if (!paymentMethod) {
            return res.status(404).json({
                success: false,
                message: "Phương thức thanh toán không tồn tại!"
            });
        }

        await PaymentMethod.updateOne({ _id: paymentMethodId }, {
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
            message: "Cập nhật phương thức thanh toán thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cập nhật phương thức thanh toán thất bại!"
        });
    }
};

// [DELETE] /admin/payment-methods/:id
module.exports.deletePaymentMethod = async (req, res) => {
    const paymentMethodId = req.params.id;
    try {
        const paymentMethod = await PaymentMethod.findById(paymentMethodId);
        if (!paymentMethod) {
            return res.status(404).json({
                success: false,
                message: "Phương thức thanh toán không tồn tại!"
            });
        }

        await PaymentMethod.deleteOne({ _id: paymentMethodId });
        res.json({
            success: true,
            message: "Xóa phương thức thanh toán thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Xóa phương thức thanh toán thất bại!"
        });
    }
};
