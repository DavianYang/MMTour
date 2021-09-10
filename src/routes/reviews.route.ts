import { Router } from 'express';
import { ReviewController } from '@controllers/reviews.controller';
import { protect, restrictTo } from '@middlwares/auth.middleware';

class ReviewRoute {
  public path = '/reviews';
  public router = Router();
  public reviewController = new ReviewController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.use(protect);
    this.router
      .route(`${this.path}/`)
      .get(this.reviewController.getAllReviews)
      .post(restrictTo('user'), this.reviewController.setTourUserIds, this.reviewController.createReview);

    this.router
      .route(`${this.path}/:id`)
      .get(this.reviewController.getReview)
      .patch(restrictTo('user', 'admin'), this.reviewController.updateReview)
      .delete(restrictTo('uesr', 'admin'), this.reviewController.deleteReview);
  }
}

export { ReviewRoute };
