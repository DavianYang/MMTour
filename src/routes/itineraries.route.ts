import { Router } from 'express';
import ItineraryController from '@controllers/itineraries.controller';
import { protect, restrictTo } from '@middlwares/auth.middleware';

class ItineraryRoute {
  public path = '/itineraries';
  public router = Router();
  public itineraryController = new ItineraryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(protect);

    this.router.use(restrictTo('admin', 'lead-guide'));

    this.router.route(`${this.path}/`).get(this.itineraryController.getAllItineraries).post(this.itineraryController.createItinerary);

    this.router
      .route(`${this.path}/:id`)
      .get(this.itineraryController.getItinerary)
      .patch(this.itineraryController.updateItinerary)
      .delete(this.itineraryController.deleteItinerary);
  }
}

export { ItineraryRoute };
