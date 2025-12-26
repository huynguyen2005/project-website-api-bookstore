const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/blog.controller");

router.get("/", controller.getBlogs);
router.get("/:slug", controller.getDetailBlog);

module.exports = router;