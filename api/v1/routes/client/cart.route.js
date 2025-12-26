const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");

router.get("/", controller.getCart);
router.post("/:bookId", controller.addToCart);
router.put("/:bookId", controller.updateCart);
router.delete("/:bookId", controller.deleteBook);
router.patch("/:bookId/select", controller.toggleSelectBook);

module.exports = router;