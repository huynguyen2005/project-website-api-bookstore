const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/book-category.controller");

router.get("/", controller.index);
router.get("/all", controller.getAll);
router.post("/create", controller.createCategory);
router.get("/:id", controller.getCategory);
router.put("/edit/:id", controller.editCategory);
router.delete("/delete/:id", controller.deleteCategory);

module.exports = router;