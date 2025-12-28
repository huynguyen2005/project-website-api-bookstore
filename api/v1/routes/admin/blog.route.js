const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/blog.controller");

router.get("/", controller.index);
router.post("/", controller.createBlog);
router.get("/:id", controller.getBlog);
router.put("/:id", controller.editBlog);
router.delete("/:id", controller.deleteBlog);
router.delete("/", controller.deleteManyBlog);

module.exports = router;