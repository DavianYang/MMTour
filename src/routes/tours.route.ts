import { Router } from 'express';
import { TourController } from '@controllers/tours.controller';

class TourRoute {
  public path = '/tours';
  public router = Router();
  public tourController = new TourController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.route(`${this.path}/`).get(this.tourController.getAllTours).post(this.tourController.createTour);

    this.router
      .route(`${this.path}/:id`)
      .get(this.tourController.getTour)
      .patch(this.tourController.updateTour)
      .delete(this.tourController.deleteTour);

    this.router.route(`${this.path}/top/:number`).get(this.tourController.aliasTopTours, this.tourController.getAllTours);

    this.router.route(`${this.path}/stats`).get(this.tourController.getTourStats);

    this.router.route(`${this.path}/plan/:year/:month`).get(this.tourController.getMonthlyWeeklyPlan);
  }
}

export { TourRoute };
