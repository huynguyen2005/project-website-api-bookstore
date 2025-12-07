const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/book.controller");

router.get("/", controller.index);
router.post("/create", controller.createPost);

module.exports = router;