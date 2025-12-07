const Book = require("../../models/book.model");

module.exports.index = async (req, res) => {
    try {
        const books = await Book.find({});
        res.json(books);
    } catch (error) {
        res.json({
            code: 500,
            message: "Lấy sách thất bại !!!"
        });
    }
};

module.exports.createPost = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
        const book = new Book(data);
        await book.save();
        res.json({
            success: true,
            message: "Thêm sách thành công!",
        });
    } catch (error) {
        res.json({
            code: 500,
            message: "Tạo sách thất bại!"
        });
    }
};




