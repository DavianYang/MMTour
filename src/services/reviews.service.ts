import { Request } from 'express';
import { reviewModel } from '@models/reviews.model';
import { QueryString } from '@interfaces/queries.interface';
import { findAll, findOne, createOne, updateOne, deleteOne } from '@services/factory.service';

class ReviewService {
  public reviews = reviewModel;

  // CREATE
  public async createReview(req: Request) {
    return createOne(this.reviews, req.body);
  }

  // FIND
  public async findAllReviews(req: Request) {
    return await findAll(this.reviews, req.query as QueryString);
  }

  public async findReview(req: Request) {
    return await findOne(this.reviews, req.params.id);
  }

  // UPDATE
  public async updateReview(req: Request) {
    return await updateOne(this.reviews, req.params.id, req.body);
  }

  // DELETE
  public async deleteReview(req: Request) {
    return await deleteOne(this.reviews, req.params.id);
  }
}

export { ReviewService };
