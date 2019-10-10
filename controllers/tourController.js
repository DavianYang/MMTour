const Tour = require("../models/tourModel");
const factory = require("./handleFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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

exports.getTourWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;

  const [lat, lng] = latlng.split(",");

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide letter latitute and longitude in the format lat,lng.",
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: "success",
    result: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide letter latitute and longitude in the format lat,lng.",
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      // to define, at least geospatial index
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: "distance",
        distanceMultiplier: multiplier // m to km
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      data: distances
    }
  });
});
// exports.getTourNearBy = catchAsync(async (req, res, next) => {
//   const { latlng } = req.params;

//   const [lat, lng] = latlng.split(",");

//   if (!lat || !lng) {
//     next(
//       new AppError(
//         "Please provide letter latitute and longitude in the format lat,lng.",
//         400
//       )
//     );
//   }

//   const max = 50 / 6378.1;
//   const min = 10 / 6378.1;

//   console.log(max, min);

//   const tours = await Tour.find({
//     startLocation: {
//       $near: {
//         $geometry: { type: "Point", coordinates: [lng * 1, lat * 1] },
//         $maxDistance: max,
//         $minDistance: min
//       }
//     }
//   });

//   res.status(200).json({
//     status: "success",
//     result: tours.length,
//     data: {
//       data: tours
//     }
//   });
// });
