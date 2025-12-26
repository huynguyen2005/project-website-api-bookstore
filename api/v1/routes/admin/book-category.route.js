const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/book-category.controller");

router.get("/", controller.index);
router.get("/list", controller.getListCategory);
router.post("/", controller.createCategory);
router.get("/:id", controller.getCategory);
router.put("/:id", controller.editCategory);
router.delete("/:id", controller.deleteCategory);

module.exports = router;
