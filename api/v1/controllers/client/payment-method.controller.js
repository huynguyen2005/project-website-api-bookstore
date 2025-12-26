const PaymentMethod = require("../../models/payment-method.model");

// [GET] /payment-methods
module.exports.getPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.find({ status: "active" }).select("name");
        res.json({ paymentMethods });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};