const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/publisher.controller");

router.get("/", controller.index);
router.get("/all", controller.getAll);
router.post("/create", controller.createPublisher);
router.get("/:id", controller.getPublisher);
router.put("/edit/:id", controller.editPublisher);
router.delete("/delete/:id", controller.deletePublisher);

module.exports = router;
