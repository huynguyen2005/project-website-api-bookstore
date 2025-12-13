const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/distributor.controller");

router.get("/", controller.index);
router.get("/list", controller.getListDistributor);
router.post("/create", controller.createDistributor);
router.get("/:id", controller.getDistributor);
router.put("/edit/:id", controller.editDistributor);
router.delete("/delete/:id", controller.deleteDistributor);

module.exports = router;
