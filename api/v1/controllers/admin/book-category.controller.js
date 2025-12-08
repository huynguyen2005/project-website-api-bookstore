const BookCategory = require("../../models/book-category.model");
const categoryHelper = require("../../../../helpers/category");
const searchInforHelper = require("../../../../helpers/searchInfor");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /admin/book-category
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

        const allCategory = await BookCategory.find(find);
        if (allCategory.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy danh mục!"
            });
        }

        if (keyword || status) {
            return res.json(allCategory);
        }
        const newAllCategory = categoryHelper.createTree(allCategory);
        res.json(newAllCategory);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy danh mục sách thất bại!"
        });
    }
};

//[GET] /admin/book-category/all
module.exports.getAll = async (req, res) => {
    try {
        const categories = await BookCategory.find().select("id name");
        res.json(categories);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy danh mục sách thất bại!"
        });
    }
};

//[GET] /admin/book-category/:id
module.exports.getCategory = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await BookCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Danh mục không tồn tại!"
            });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy danh mục sách thất bại!"
        });
    }
};

//[POST] /admin/book-category/create
module.exports.createCategory = async (req, res) => {
    const data = req.body;
    try {
        if (!data.position) {
            data.position = await BookCategory.countDocuments() + 1;
        }
        const bookCategory = new BookCategory(data);
        bookCategory.save();
        res.json({
            success: true,
            message: "Thêm danh mục sách thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Thêm danh mục sách thất bại!"
        });
    }
};

//[PUT] /admin/book-category/edit/:id
module.exports.editCategory = async (req, res) => {
    const categoryId = req.params.id;
    const data = req.body;
    try {
        const category = await BookCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Danh mục không tồn tại!"
            });
        }
        await BookCategory.updateOne({ _id: categoryId }, data);
        res.json({
            success: true,
            message: "Cập nhật danh mục sách thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cập nhật danh mục sách thất bại!"
        });
    }
};


// [DELETE] /admin/book-category/delete/:id
module.exports.deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await BookCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Danh mục không tồn tại!"
            });
        }

        const children = await BookCategory.find({ parentId: categoryId });

        if (children.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Không thể xóa! Danh mục này đang có danh mục con!"
            });
        }

        await BookCategory.deleteOne({ _id: categoryId });
        res.json({
            success: true,
            message: "Xóa danh mục sách thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Xóa danh mục sách thất bại!"
        });
    }
};


