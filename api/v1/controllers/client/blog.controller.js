const Blog = require("../../models/blog.model");
const paginationHelper = require("../../../../helpers/pagination");

// [GET] /blogs
module.exports.getBlogs = async (req, res) => {
    const { page } = req.query;
    try {
        const find = {
            status: "active"
        };

        const totalRecord = await Blog.countDocuments(find);
        const initPagination = paginationHelper(totalRecord, page);

        const blogs = await Blog.find(find)
            .sort({ position: -1 })
            .select("title thumbnail createdBy slug")
            .limit(initPagination.limitRecord)
            .skip(initPagination.skip);

        res.json({ blogs, totalPage: initPagination.totalPage });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

// [GET] /blogs/:slug
module.exports.getDetailBlog = async (req, res) => {
    const { slug } = req.params;
    try {
        const find = {
            slug,
            status: "active"
        };

        const blog = await Blog.findOne(find).select("title thumbnail content createdBy");

        res.json({ blog });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};