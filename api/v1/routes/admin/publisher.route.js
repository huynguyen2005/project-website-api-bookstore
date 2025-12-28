const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/publisher.controller");

router.get("/", controller.index);
router.get("/list", controller.getListPublisher);
router.post("/", controller.createPublisher);
router.get("/:id", controller.getPublisher);
router.put("/:id", controller.editPublisher);
router.delete("/:id", controller.deletePublisher);
router.delete("/", controller.deleteManyPublisher);

module.exports = router;
