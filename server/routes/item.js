const express = require("express");
const router = new express.Router();
const itemController = require("../controllers/item");
const auth = require("../middleware/auth");

router.post("/items", auth, itemController.addItem);
router.get("/items",auth,  itemController.fetchItems);
router.get("/items/:id", auth, itemController.fetchSingleItem);
router.delete("items/:id", auth, itemController.deleteItem);

module.exports = router;