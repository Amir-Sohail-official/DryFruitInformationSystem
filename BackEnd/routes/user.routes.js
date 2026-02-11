const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");
const authMiddleWare = require("../middleware/auth");
const uploadUserImage = require("../middleware/upload-user-image");

router.post(
  "/signup",
  uploadUserImage.single("profilePic"),
  authController.signup
);
router.post("/login", authController.login);
router.post("/forgotpassword", authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword);

router.use(authMiddleWare.protect);

router.get("/me", userController.getMe);
router.patch("/updateMyPassword", authController.updateMyPassword);
router.patch(
  "/updateMe",
  uploadUserImage.single("profilePic"),
  userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);
router.delete(
  "/deleteUser/:id",
  authMiddleWare.protect,
  authMiddleWare.restrictTo("admin"),
  userController.deleteUser
);

router.use(authMiddleWare.restrictTo("admin"));
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.patch("/:id", userController.updateUser);

module.exports = router;
