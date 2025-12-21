const Cart = require("../../models/cart.model");
const { calculateNewPrice } = require("../../../../helpers/book");

// [GET] /cart/
module.exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.cart._id)
            .select("-createdAt -updatedAt -__v")
            .populate({
                path: "books.book_id",
                select: "title thumbnail price slug discountPercent"
            })
            .lean();

        for (const book of cart.books) {
            calculateNewPrice(book.book_id);
            book.totalAmount = book.quantity * book.book_id.newPrice;
        }
        cart.totalPrice = cart.books.reduce((sum, item) => sum + item.totalAmount, 0);
        res.json({ cart });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// [POST] /cart/add/:bookId
module.exports.addToCart = async (req, res) => {
    const bookId = req.params.bookId;
    const quantity = req.body.quantity;
    const cart = req.cart;
    try {
        const exitBookInCart = cart.books.find(item => item.book_id == bookId);
        if (exitBookInCart) {
            const newQuantity = exitBookInCart.quantity + quantity;
            await Cart.updateOne({
                _id: cart.id,
                "books.book_id": bookId
            },
                {
                    $set: {
                        "books.$.quantity": newQuantity
                    }
                });
        } else {
            await Cart.updateOne({
                _id: cart.id,
            },
                {
                    $push: {
                        books: {
                            book_id: bookId,
                            quantity: quantity
                        }
                    }
                });
        }
        res.json({ message: "Thêm sách vào giỏ thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// [PUT] /cart/update/:bookId
module.exports.updateCart = async (req, res) => {
    const bookId = req.params.bookId;
    const quantity = req.body.quantity;
    const cart = req.cart;
    try {
        await Cart.updateOne({
            _id: cart._id,
            "books.book_id": bookId
        }, {
            $set: {
                "books.$.quantity": quantity
            }
        });
        res.json({ message: "Cập nhật giỏ hàng thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};


// [DELETE] /cart/delete/:bookId
module.exports.deleteBook = async (req, res) => {
    const bookId = req.params.bookId;
    const cart = req.cart;
    try {
        await Cart.updateOne({
            _id: cart._id,
        }, {
            $pull: {
                books: { book_id: bookId }
            }
        });
        res.json({ message: "Xóa sách khỏi giỏ hàng thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};