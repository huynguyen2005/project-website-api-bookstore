const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/blog.controller");

router.get("/", controller.index);
router.post("/create", controller.createBlog);
router.get("/:id", controller.getBlog);
router.put("/edit/:id", controller.editBlog);
router.delete("/delete/:id", controller.deleteBlog);

module.exports = router;
