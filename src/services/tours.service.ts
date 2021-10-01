import { Request } from 'express';
import { tourModel } from '@models/tours.model';
import { findAll, findOne, createOne, updateOne, deleteOne } from '@services/factory.service';
import { QueryString } from '@interfaces/queries.interface';

class TourService {
  public tours = tourModel;

  public async findAllTours(query: object) {
    return await findAll(this.tours, query as QueryString);
  }

  public async findTour(id: string) {
    return await findOne(this.tours, id);
  }

  public async createTour(tourBody: object) {
    return await createOne(this.tours, tourBody);
  }

  public async updateTour(id: string, body: object) {
    return await updateOne(this.tours, id, body);
  }

  public async deleteTour(id: string) {
    return await deleteOne(this.tours, id);
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
