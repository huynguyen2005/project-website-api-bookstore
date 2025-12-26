const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/author.controller");

router.get("/", controller.index);
router.get("/list", controller.getListAuthor);
router.post("/", controller.createAuthor);
router.get("/:id", controller.getAuthor);
router.put("/:id", controller.editAuthor);
router.delete("/:id", controller.deleteAuthor);

module.exports = router;
