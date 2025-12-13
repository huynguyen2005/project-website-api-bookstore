const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/book.controller");

router.get("/", controller.index);
router.post("/create", controller.createBook);
router.get("/:id", controller.getBook);
router.put("/edit/:id", controller.editBook);
router.delete("/delete/:id", controller.deleteBook);

module.exports = router;
