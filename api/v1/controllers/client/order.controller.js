const Order = require("../../models/order.model");

// [GET] /orders
module.exports.getOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const orders = await Order.find({ user_id: userId }).select("createdAt orderStatus paymentStatus totalPrice");
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// [GET] /orders/:orderId
module.exports.getDetailOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const myOrder = await Order.findById(orderId).select("-updatedAt -__v")
            .populate({ path: "books.book_id", select: "title" })
            .populate({ path: "payment_method_id", select: "name" })
            .populate({ path: "carrier_id", select: "name" });
        if (!myOrder) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
        }
        res.json({ myOrder });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};