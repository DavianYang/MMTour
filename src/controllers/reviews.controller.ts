import { NextFunction, Request, Response } from 'express';
import { ReviewService } from '@services/reviews.service';
import AppError from '@exceptions/AppError';
import catchAsync from '@utils/catchAsync';
import * as strings from '@resources/strings';

class ReviewController {
  private reviewService = new ReviewService();

  public setTourUserIds = (req: Request, res: Response, next: NextFunction) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
  };

  // GET
  public getAllReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await this.reviewService.findAllReviews(req.query);

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: reviews,
    });
  });

  public getReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const review = await this.reviewService.findReview(req.params.id);

    if (!review) {
      return next(new AppError(strings.REVIEW_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: review,
      },
    });
  });

  // CREATE
  public createReview = catchAsync(async (req: Request, res: Response) => {
    const createdReview = await this.reviewService.createReview(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        data: createdReview,
      },
    });
  });

  // UPDATE
  public updateReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const updatedReview = await this.reviewService.updateReview(req.params.id, req.body);

    if (!updatedReview) {
      return next(new AppError(strings.REVIEW_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedReview,
      },
    });
  });

  // DELETE
  public deleteReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await this.reviewService.deleteReview(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
}

export { ReviewController };
