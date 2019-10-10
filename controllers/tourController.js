const Tour = require("../models/tourModel");
const factory = require("./handleFactory");
const catchAsync = require("../utils/catchAsync");

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage, price";
  req.query.fields = "name, price, ratingsAverage, summary, difficult";
  next();
};

exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour);

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" }
      }
    },
    {
      $sort: {
        avgPrice: -1
      }
    }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      // useful for desconstruting array
      $unwind: "$startDates" // deconstruct array from input and create one element for output
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" } // to push name field into array
      }
    },
    {
      $addFields: {
        month: "$_id" // get value from _id field
      }
    },
    {
      $project: {
        _id: 0 // to get rid of _id field
      }
    },
    {
      $sort: {
        numTourStarts: -1
      }
    }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan
    }
  });
});

exports.getWeeklyPlan = catchAsync(async (req, res, next) => {
  const month = req.params.month * 1;
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates"
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-${month}-01`),
          $lte: new Date(`${year}-${month}-31`)
        }
      }
    },
    {
      $group: {
        _id: { $dayOfMonth: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" }
      }
    },
    {
      $addFields: {
        dayOfMonth: "$_id"
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {
        numTourStarts: -1
      }
    }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan
    }
  });
});
