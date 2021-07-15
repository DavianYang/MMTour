import { Request } from 'express';
import { tourModel } from '@models/tours.model';
import { findAll, findOne, createOne, updateOne, deleteOne } from '@services/factory.service';
import { QueryString } from '@interfaces/queries.interface';

class TourService {
  public tours = tourModel;

  public async findAllTours(req: Request) {
    return await findAll(this.tours, req.query as QueryString);
  }

  public async findTour(req: Request) {
    return await findOne(this.tours, req.params.id);
  }

  public async createTour(req: Request) {
    return await createOne(this.tours, req.body);
  }

  public async updateTour(req: Request) {
    return await updateOne(this.tours, req.params.id, req.body);
  }

  public async deleteTour(req: Request) {
    return await deleteOne(this.tours, req.params.id);
  }

  public async findTourStats() {
    return await this.tours.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsQuantity' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: {
          avgPrice: -1,
        },
      },
    ]);
  }
}

export { TourService };
