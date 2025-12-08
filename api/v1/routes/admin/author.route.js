const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/author.controller");

router.get("/", controller.index);
router.get("/all", controller.getAll);
router.post("/create", controller.createAuthor);
router.get("/:id", controller.getAuthor);
router.put("/edit/:id", controller.editAuthor);
router.delete("/delete/:id", controller.deleteAuthor);

module.exports = router;