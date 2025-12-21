const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");

router.get("/", controller.getCart);
router.post("/add/:bookId", controller.addToCart);
router.put("/update/:bookId", controller.updateCart);
router.delete("/delete/:bookId", controller.deleteBook);

module.exports = router;