const Book = require("../../models/book.model");
const searchInforHelper = require("../../../../helpers/searchInfor");
const paginationHelper = require("../../../../helpers/pagination");
const uploadToCloudinaryHelper = require("../../../../helpers/uploadToCloudinary");

// [GET] /admin/books
module.exports.index = async (req, res) => {
    const page = req.query.page;
    const keyword = req.query.keyword;
    const status = req.query.status;
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    const find = {};
    const sort = {};
    try {
        if (keyword) {
            const objectSearch = searchInforHelper(keyword);
            find.name = objectSearch.regex;
        }

        if (status) {
            find.status = status;
        }

        if (sortKey && sortValue) {
            sort[sortKey] = sortValue;
        }

        const totalRecord = await Book.countDocuments(find);
        const initPagination = paginationHelper(totalRecord, page);

        const allBooks = await Book.find(find).sort(sort).limit(initPagination.limitRecord).skip(initPagination.skip);

        res.json({
            books: allBooks,
            pageTotal: initPagination.totalPage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy sách thất bại!"
        });
    }
};

// [GET] /admin/books/:id
module.exports.getBook = async (req, res) => {
    const bookId = req.params.id;
    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Sách không tồn tại!"
            });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy sách thất bại!"
        });
    }
};

// [POST] /admin/books
module.exports.createBook = async (req, res) => {
    const data = req.body;
    try {
        if (data.thumbnail) {
            const result = await uploadToCloudinaryHelper.uploader.upload(data.thumbnail);
            data.thumbnail = result.secure_url;
        }
        if(data.images){
            const arr = [];
            for (const image of data.images) {
                const result = await uploadToCloudinaryHelper.uploader.upload(image);
                arr.push(result.secure_url);
            }
            data.images = arr;
        }
        if (!data.position) {
            data.position = await Book.countDocuments() + 1;
        }

        const createdBy = {
            account_id: req.accountId
        };
        data.createdBy = createdBy;

        const book = new Book(data);
        await book.save();
        res.json({
            success: true,
            message: "Thêm sách thành công!"
        });
    } catch (error) {
        res.status(500).json({
            message: error
        });
    }
};

// [PUT] /admin/books/:id
module.exports.editBook = async (req, res) => {
    const bookId = req.params.id;
    const data = req.body;
    try {
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Sách không tồn tại!"
            });
        }

        if (data.thumbnail) {
            const result = await uploadToCloudinaryHelper.uploader.upload(data.thumbnail);
            data.thumbnail = result.secure_url;
        }

        if(data.images){
            const arr = [];
            for (const image of data.images) {
                const result = await uploadToCloudinaryHelper.uploader.upload(image);
                arr.push(result.secure_url);
            }
            data.images = arr;
        }
        
        await Book.updateOne({ _id: bookId }, {
            ...data,
            $push: {
                updatedBy: {
                    account_id: req.accountId,
                    updatedAt: Date.now()
                }
            }
        });
        res.json({
            success: true,
            message: "Cập nhật sách thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cập nhật sách thất bại!"
        });
    }
};

// [DELETE] /admin/books/:id
module.exports.deleteBook = async (req, res) => {
    const bookId = req.params.id;
    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Sách không tồn tại!"
            });
        }

        await Book.deleteOne({ _id: bookId });
        res.json({
            success: true,
            message: "Xóa sách thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Xóa sách thất bại!"
        });
    }
};
