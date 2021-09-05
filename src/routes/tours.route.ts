import { Router } from 'express';
import { TourController } from '@controllers/tours.controller';
import { protect, restrictTo } from '@middlwares/auth.middleware';

class TourRoute {
  public path = '/tours';
  public router = Router();
  public tourController = new TourController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.route(`${this.path}/top/:number`).get(this.tourController.aliasTopTours, this.tourController.getAllTours);
    this.router.route(`${this.path}/stats`).get(this.tourController.getTourStats);
    this.router.route(`${this.path}/plan/:year/:month`).get(protect, restrictTo('admin', 'lead-guide', 'guide'), this.tourController.getMonthlyPlan);

    this.router
      .route(`${this.path}/`)
      .get(this.tourController.getAllTours)
      .post(protect, restrictTo('admin', 'lead-guide'), this.tourController.createTour);

    this.router
      .route(`${this.path}/:id`)
      .get(this.tourController.getTour)
      .patch(protect, restrictTo('admin', 'lead-guide'), this.tourController.updateTour)
      .delete(protect, restrictTo('admin', 'lead-guide'), this.tourController.deleteTour);
  }
}

export { TourRoute };
