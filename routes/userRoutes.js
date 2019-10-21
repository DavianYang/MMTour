const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// Todo List
// Watch Password Change Algo
// Watch Error Handling

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.use(authController.protect);

router
  .route("/me")
  .get(userController.getMe)
  .get(userController.getUser)
  .patch(userController.updateMe)
  .delete(userController.deleteMe);

router
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser) // Not Test Yet
  .delete(userController.deleteUser); // Not Test Yet

module.exports = router;
