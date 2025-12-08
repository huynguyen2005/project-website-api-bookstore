const PaymentMethod = require("../../models/payment-method.model");
const searchInforHelper = require("../../../../helpers/searchInfor");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /admin/payment-method
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
        const totalRecord = await PaymentMethod.countDocuments(find);
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

        const allPaymentMethod = await PaymentMethod.find(find)
            .sort(sort)
            .limit(initPagination.limitRecord)
            .skip(initPagination.skip);

        if (allPaymentMethod.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phương thức thanh toán!"
            });
        }

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

// [GET] /admin/payment-method/all
module.exports.getAll = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.find().select("id name");
        res.json(paymentMethods);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy phương thức thanh toán thất bại!"
        });
    }
};

// [GET] /admin/payment-method/:id
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

// [POST] /admin/payment-method/create
module.exports.createPaymentMethod = async (req, res) => {
    const data = req.body;
    try {
        if (!data.position) {
            data.position = await PaymentMethod.countDocuments() + 1;
        }
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

// [PUT] /admin/payment-method/edit/:id
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

        await PaymentMethod.updateOne({ _id: paymentMethodId }, data);
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

// [DELETE] /admin/payment-method/delete/:id
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
