const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/book-category.controller");

router.get("/", controller.getAll);
router.get("/:slug", controller.getBooksByCategory);

module.exports = router;