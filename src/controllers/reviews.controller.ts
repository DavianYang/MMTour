import { NextFunction, Request, Response } from 'express';
import { ReviewService } from '@services/reviews.service';
import AppError from '@exceptions/AppError';
import catchAsync from '@utils/catchAsync';
import { REVIEW_WITH_ID_NOT_FOUND } from '@resources/strings';

class ReviewController {
  private reviewService = new ReviewService();

  public setTourUserIds = (req: Request, res: Response, next: NextFunction) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
  };

  public getAllReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await this.reviewService.findAllReviews(req);

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: reviews,
    });
  });

  public getReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const review = await this.reviewService.findReview(req);

    if (!review) {
      return next(new AppError(REVIEW_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: review,
      },
    });
  });

  public createReview = catchAsync(async (req: Request, res: Response) => {
    const createdReview = await this.reviewService.createReview(req);

    res.status(200).json({
      status: 'success',
      data: {
        data: createdReview,
      },
    });
  });

  public updateReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const updatedReview = await this.reviewService.updateReview(req);

    if (!updatedReview) {
      return next(new AppError(REVIEW_WITH_ID_NOT_FOUND, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedReview,
      },
    });
  });

  public deleteReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await this.reviewService.deleteReview(req);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
}

export { ReviewController };
