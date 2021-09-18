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
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);
  }

  public async findMonthlyPlan(year: number, month?: number | null) {
    return await this.tours.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-${month === null ? 1 : month}-01`),
            $lte: new Date(`${year}-${month === null ? 12 : month}-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numTourStarts: -1,
        },
      },
    ]);
  }
}

export { TourService };
