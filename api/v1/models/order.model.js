const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        cart_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart"
        },
        userInfor: {
            fullName: String,
            phone: String,
            address: String,
            note: String
        },
        payment_method_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PaymentMethod"
        },
        carrier_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Carrier"
        },
        orderStatus: {
            type: String,
            enum: ["CREATED", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"],
            default: "CREATED"
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED"],
            default: "PENDING"
        },
        books: [
            {
                book_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Book"
                },
                price: Number,
                discountPercent: Number,
                quantity: Number,
                totalAmount: Number
            }
        ],
        totalPrice: Number,
        shipping_fee: Number,
        momoTransId: String
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
