const Order = require("../../models/order.model");
const Book = require("../../models/book.model");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /admin/orders
module.exports.getOrders = async (req, res) => {
    const { status, fromDate, toDate, keyword, page } = req.query;

    try {
        let filter = {};
        if (status) filter.orderStatus = status;

        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) {
                filter.createdAt.$gte = new Date(fromDate);
            }
            if (toDate) {
                filter.createdAt.$lte = new Date(toDate);
            }
        }

        if (keyword) {
            filter.$or = [
                { _id: keyword },
                { "userInfor.fullName": { $regex: keyword, $options: "i" } },
                { "userInfor.phone": { $regex: keyword } }
            ];
        }

        // Phân trang
        const totalRecord = await Order.countDocuments(filter);
        const initPagination = paginationHelper(totalRecord, page);

        const orders = await Order.find(filter)
            .select("userInfor.fullName userInfor.phone createdAt totalPrice orderStatus paymentStatus")
            .sort({ createdAt: -1 })
            .limit(initPagination.limitRecord)
            .skip(initPagination.skip);

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// [GET] /admin/orders/:id
module.exports.getOrderDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id)
            .populate("user_id", "fullName email")
            .populate("payment_method_id", "name")
            .populate("carrier_id", "name")
            .populate("books.book_id", "title thumbnail");

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// [PUT] /admin/orders/:id/status
module.exports.changeOrderStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    const ORDER_FLOW = {
        CREATED: ["CONFIRMED", "CANCELLED"],
        CONFIRMED: ["SHIPPING", "CANCELLED"],
        SHIPPING: ["DELIVERED"],
        DELIVERED: [],
        CANCELLED: []
    };

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        const currentStatus = order.orderStatus;

        if (!ORDER_FLOW[currentStatus]) {
            return res.status(400).json({ message: "Trạng thái hiện tại không hợp lệ" });
        }

        if (!ORDER_FLOW[currentStatus].includes(status)) {
            return res.status(400).json({
                message: `Không thể chuyển từ ${currentStatus} sang ${status}`
            });
        }

        if (status === "DELIVERED" && order.paymentStatus === "PENDING") {
            order.paymentStatus = "PAID";
        }

        if (status === "CANCELLED" && order.paymentStatus === "PENDING") {
            const updates = order.books.map(item => ({
                updateOne: {
                    filter: { _id: item.book_id },
                    update: { $inc: { stockQuantity: item.quantity } }
                }
            }));
            await Book.bulkWrite(updates);

            order.paymentStatus = "FAILED";
        }

        order.orderStatus = status;
        await order.save();

        res.json({ message: "Cập nhật trạng thái thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};




