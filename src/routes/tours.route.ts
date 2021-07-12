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
  }
}

export { TourRoute };
