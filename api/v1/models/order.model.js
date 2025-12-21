const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        cart_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart"
        },
        userInfor : {
            fullName: String,
            phone: String,
            address: String,
            note: String
        },
        payment_method_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "paymentMethod"
        },
        status : String,
        books : [
            {
                book_id: String,
                title: String,
                price: Number,
                discountPercent: Number,
                quantity: Number, 
            }
        ]
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
