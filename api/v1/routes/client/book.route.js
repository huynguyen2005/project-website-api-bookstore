const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/book.controller");

router.get("/featured", controller.getFeaturedBooks);
router.get("/sale", controller.getSaleBooks);
router.get("/:slug", controller.getBookDetail);

module.exports = router;