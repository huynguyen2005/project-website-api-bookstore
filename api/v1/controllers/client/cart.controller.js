const Cart = require("../../models/cart.model");
const { calculateNewPrice } = require("../../../../helpers/book");
const Book = require("../../models/book.model");

// [GET] /carts/
module.exports.getCart = async (req, res) => {
    const cartId = req.cart._id;
    try {
        const cart = await Cart.findById(cartId)
            .populate({
                path: "books.book_id",
                select: "title thumbnail price slug discountPercent"
            });

        const books = cart.books.map(item => {
            const newPrice = calculateNewPrice(item.book_id);
            return {
                ...item.toObject(),
                newPrice,
                totalAmount: item.quantity * newPrice
            };
        });

        const totalPrice = books.filter(b => b.isSelected)
            .reduce((s, b) => s + b.totalAmount, 0);

        res.json({ books, totalPrice });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// [POST] /carts/:bookId
module.exports.addToCart = async (req, res) => {
    const bookId = req.params.bookId;
    const quantity = req.body.quantity;
    const cart = req.cart;
    try {
        const book = await Book.findById(bookId).select("stockQuantity");
        const exitBookInCart = cart.books.find(item => item.book_id == bookId);
        if (exitBookInCart) {
            const newQuantity = exitBookInCart.quantity + quantity;

            if (newQuantity > book.stockQuantity) {
                return res.status(400).json({
                    message: `Chỉ còn ${book.stockQuantity} sản phẩm trong kho`
                });
            }

            await Cart.updateOne(
                { _id: cart.id, "books.book_id": bookId },
                { $set: { "books.$.quantity": newQuantity } }
            );
        } else {
            if (quantity > book.stockQuantity) {
                return res.status(400).json({
                    message: `Chỉ còn ${book.stockQuantity} sản phẩm trong kho`
                });
            }

            await Cart.updateOne(
                { _id: cart.id },
                { $push: { books: { book_id: bookId, quantity: quantity } } }
            );
        }
        res.json({ message: "Thêm sách vào giỏ thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// [PUT] /carts/:bookId
module.exports.updateCart = async (req, res) => {
    const { bookId } = req.params;
    const { quantity } = req.body;
    const cartId = req.cart._id;

    try {
        const book = await Book.findById(bookId).select("stockQuantity");
        if (quantity > book.stockQuantity) {
            return res.status(400).json({
                message: `Chỉ còn ${book.stockQuantity} sản phẩm trong kho`
            });
        }

        const cart = await Cart.findOneAndUpdate(
            { _id: cartId, "books.book_id": bookId },
            { $set: { "books.$.quantity": quantity, "books.$.isSelected": true } },
            { new: true }
        ).populate({
            path: "books.book_id",
            select: "title thumbnail price slug discountPercent"
        });

        const books = cart.books.map(item => {
            const newPrice = calculateNewPrice(item.book_id);
            return {
                ...item.toObject(),
                newPrice,
                totalAmount: item.quantity * newPrice
            };
        });

        const totalPrice = books.filter(b => b.isSelected)
            .reduce((s, b) => s + b.totalAmount, 0);

        res.json({ books, totalPrice });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};


// [DELETE] /carts/:bookId
module.exports.deleteBook = async (req, res) => {
    const bookId = req.params.bookId;
    const cartId = req.cart?._id;

    try {
        const cart = await Cart.findOneAndUpdate(
            { 
                _id: cartId 
            },
            { 
                $pull: { books: { book_id: bookId } } 
            },
            { new: true }
        ).populate({
            path: "books.book_id",
            select: "title thumbnail price slug discountPercent"
        });

        const books = cart.books.map(item => {
            const newPrice = calculateNewPrice(item.book_id);
            return {
                ...item.toObject(),
                newPrice,
                totalAmount: item.quantity * newPrice
            };
        });

        const totalPrice = books.filter(b => b.isSelected)
            .reduce((s, b) => s + b.totalAmount, 0);

        res.json({ books, totalPrice });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};


// [PUT] /carts/:bookId/select
module.exports.toggleSelectBook = async (req, res) => {
    const cartId = req.cart._id;
    const bookId = req.params.bookId;

    try {
        const cart = await Cart.findOne(
            { _id: cartId }
        ).populate({
            path: "books.book_id",
            select: "title thumbnail price slug discountPercent"
        });

        const book = cart.books.find(
            item => item.book_id._id.toString() === bookId
        );

        if (!book) {
            return res.status(404).json({ message: "Sách không tồn tại trong giỏ hàng" });
        }

        book.isSelected = !book.isSelected;

        await cart.save();

        const books = cart.books.map(item => {
            const newPrice = calculateNewPrice(item.book_id);
            return {
                ...item.toObject(),
                newPrice,
                totalAmount: item.quantity * newPrice
            };
        });

        const totalPrice = books.filter(b => b.isSelected)
            .reduce((s, b) => s + b.totalAmount, 0);

        res.json({ books, totalPrice });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};
