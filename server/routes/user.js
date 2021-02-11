const express = require("express");
const router = new express.Router();
const userController = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/users/create", userController.createUser);
router.post("/users/login", userController.loginUser);
router.post("/users/logout", auth,  userController.logoutUser);
router.post("/users/logoutAll", auth,  userController.logoutAll);
router.get("/users/me", auth,  userController.userProfile);
router.patch("/users/me", auth, userController.updateUser);
router.delete("/users/me", auth,  userController.deleteUser);

module.exports = router;