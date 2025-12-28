const Author = require("../../models/author.model");
const searchInforHelper = require("../../../../helpers/searchInfor");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /admin/authors
module.exports.index = async (req, res) => {
    const page = req.query.page;
    const keyword = req.query.keyword;
    const status = req.query.status;
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    const find = {};
    const sort = {};
    try {
        //Tìm kiếm
        if (keyword) {
            const objectSearch = searchInforHelper(keyword);
            find.name = objectSearch.regex;
        }

        //Lọc theo trạng thái
        if (status) {
            find.status = status;
        }

        //Sắp xếp theo tiêu chí
        if (sortKey && sortValue) {
            sort[sortKey] = sortValue;
        }

        //Phân trang
        const totalRecord = await Author.countDocuments(find);
        const initPagination = paginationHelper(totalRecord, page);

        const allAuthor = await Author.find(find).sort(sort).limit(initPagination.limitRecord).skip(initPagination.skip);

        res.json({
            authors: allAuthor,
            pageTotal: initPagination.totalPage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy tác giả thất bại!"
        });
    }
};

// [GET] /admin/authors/list
module.exports.getListAuthor = async (req, res) => {
    try {
        const authors = await Author.find().select("id name");
        res.json(authors);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy danh sách tác giả thất bại!"
        });
    }
}

// //[GET] /admin/authors/:id
module.exports.getAuthor = async (req, res) => {
    const authorId = req.params.id;
    try {
        const author = await Author.findById(authorId)
            .populate({ path: "createdBy.account_id", select: "fullName" })
            .populate({ path: "updatedBy.account_id", select: "fullName" });
        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Tác giả không tồn tại!"
            });
        }
        res.json(author);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy tác giả thất bại!"
        });
    }
};

//[POST] /admin/authors
module.exports.createAuthor = async (req, res) => {
    const data = req.body;
    try {
        if (!data.position) {
            data.position = await Author.countDocuments() + 1;
        }

        const createdBy = {
            account_id: req.accountId
        };
        data.createdBy = createdBy;

        const author = new Author(data);
        author.save();
        res.json({
            success: true,
            message: "Thêm tác giả thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Thêm tác giả thất bại!"
        });
    }
};

//[PUT] /admin/authors/:id
module.exports.editAuthor = async (req, res) => {
    const authorId = req.params.id;
    const data = req.body;
    try {
        const author = await Author.findById(authorId);
        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Tác giả không tồn tại!"
            });
        }
        await Author.updateOne({ _id: authorId }, {
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
            message: "Cập nhật tác giả thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cập nhật tác giả thất bại!"
        });
    }
};


//[DELETE] /admin/authors/:id
module.exports.deleteAuthor = async (req, res) => {
    const authorId = req.params.id;
    try {
        const author = await Author.findById(authorId);
        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Tác giả không tồn tại!"
            });
        }

        await Author.deleteOne({ _id: authorId });
        res.json({
            success: true,
            message: "Xóa tác giả thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Xóa tác giả thất bại!"
        });
    }
};

// [DELETE] /admin/authors
module.exports.deleteManyAuthor = async (req, res) => {
    const { ids } = req.body;
    try {
        await Author.deleteMany({ _id: { $in: ids } });
        res.json({
            success: true,
            message: "Xóa tác giả thành công!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Xóa tác giả thất bại!"
        });
    }
};

