const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        books: [
            {
                book_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Book"
                },
                quantity: Number
            }
        ]
    },
{
    timestamps: true
}
);

const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;
