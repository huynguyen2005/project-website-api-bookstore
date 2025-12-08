const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/carrier.controller");

router.get("/", controller.index);
router.get("/all", controller.getAll);
router.post("/create", controller.createCarrier);
router.get("/:id", controller.getCarrier);
router.put("/edit/:id", controller.editCarrier);
router.delete("/delete/:id", controller.deleteCarrier);

module.exports = router;
