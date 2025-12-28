const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/book.controller");

router.get("/", controller.index);
router.post("/", controller.createBook);
router.get("/:id", controller.getBook);
router.put("/:id", controller.editBook);
router.delete("/:id", controller.deleteBook);
router.delete("/", controller.deleteManyBook);

module.exports = router;
