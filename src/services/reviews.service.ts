import { reviewModel } from '@models/reviews.model';
import { ReviewInCreate } from '@interfaces/reviews.interface';
import { QueryString } from '@interfaces/queries.interface';
import { findAll, findOne, createOne, updateOne, deleteOne } from '@services/factory.service';

class ReviewService {
  public reviews = reviewModel;

  // CREATE
  public async createReview(reviewBody: ReviewInCreate) {
    return createOne(this.reviews, reviewBody);
  }

  // FIND
  public async findAllReviews(query: object) {
    return await findAll(this.reviews, query as QueryString);
  }

  public async findReview(id: string) {
    return await findOne(this.reviews, id);
  }

  // UPDATE
  public async updateReview(id: string, body: object) {
    return await updateOne(this.reviews, id, body);
  }

  // DELETE
  public async deleteReview(id: string) {
    return await deleteOne(this.reviews, id);
  }
}

export { ReviewService };
