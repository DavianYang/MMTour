const express = require("express");

const router = express.Router({ mergeParams: true }); // for nested route /:tourId/reviews

const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourAndUserIds,
    reviewController.createReview
  );

module.exports = router;
