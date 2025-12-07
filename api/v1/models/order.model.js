const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user_id : String,
        cart_id : String,
        userInfor : {
            fullName: String,
            phone: String,
            address: String,
            note: String,
            payment_method_id: String
        },
        status : String,
        books : [
            {
                book_id: String,
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
