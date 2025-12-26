const Blog = require("../../models/blog.model");
const searchInforHelper = require("../../../../helpers/searchInfor");
const paginationHelper = require("../../../../helpers/pagination");
const uploadToCloudinaryHelper = require("../../../../helpers/uploadToCloudinary");

// [GET] /admin/blogs
module.exports.index = async (req, res) => {
    const page = req.query.page;
    const keyword = req.query.keyword;
    const status = req.query.status;
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    const find = {};
    const sort = {};
    try {
        // Tìm kiếm
        if (keyword) {
            const objectSearch = searchInforHelper(keyword);
            find.title = objectSearch.regex;
        }

        // Lọc theo trạng thái
        if (status) {
            find.status = status;
        }

        // Sắp xếp theo tiêu chí
        if (sortKey && sortValue) {
            sort[sortKey] = sortValue;
        }

        // Phân trang
        const totalRecord = await Blog.countDocuments(find);
        const initPagination = paginationHelper(totalRecord, page);

        const allBlog = await Blog.find(find)
            .sort(sort)
            .limit(initPagination.limitRecord)
            .skip(initPagination.skip);

        res.json({
            blogs: allBlog,
            pageTotal: initPagination.totalPage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy blog thất bại!"
        });
    }
};

// [GET] /admin/blogs/:id
module.exports.getBlog = async (req, res) => {
    const blogId = req.params.id;
    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog không tồn tại!"
            });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy blog thất bại!"
        });
    }
};

// [POST] /admin/blogs
module.exports.createBlog = async (req, res) => {
    const data = req.body;
    try {
        if(data.thumbnail){
            const result = await uploadToCloudinaryHelper.uploader.upload(data.thumbnail);
            data.thumbnail = result.secure_url;
        }
        if (!data.position) {
            data.position = await Blog.countDocuments() + 1;
        }

        const createdBy = {
            account_id: req.accountId
        };
        data.createdBy = createdBy;

        const blog = new Blog(data);
        await blog.save();
        res.json({
            success: true,
            message: "Thêm blog thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Thêm blog thất bại!"
        });
    }
};

// [PUT] /admin/blogs/:id
module.exports.editBlog = async (req, res) => {
    const blogId = req.params.id;
    const data = req.body;
    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog không tồn tại!"
            });
        }
        if(data.thumbnail){
            const result = await uploadToCloudinaryHelper.uploader.upload(data.thumbnail);
            data.thumbnail = result.secure_url;
        }
        await Blog.updateOne({ _id: blogId }, {
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
            message: "Cập nhật blog thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Cập nhật blog thất bại!"
        });
    }
};

// [DELETE] /admin/blogs/:id
module.exports.deleteBlog = async (req, res) => {
    const blogId = req.params.id;
    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog không tồn tại!"
            });
        }

        await Blog.deleteOne({ _id: blogId });
        res.json({
            success: true,
            message: "Xóa blog thành công!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Xóa blog thất bại!"
        });
    }
};
