const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/distributor.controller");

router.get("/", controller.getAll);
router.get("/:slug", controller.getBooksByDistributor);

module.exports = router;