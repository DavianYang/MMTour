const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");

router
  .route("/top-5-tours")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router.route("/weekly-plan/:month/:year").get(tourController.getWeeklyPlan);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getTourWithin);

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);
// router.route("/tours-nearby/center/:latlng").get(tourController.getTourNearBy);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
