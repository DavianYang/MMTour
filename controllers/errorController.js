const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const error = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${error.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      err: err,
      message: err.message,
      stack: err.stack
    });
  }

  // RENDER WEBISTE
  console.log("ERROR ☣️: ", err);
  return res.status(err.statusCode).json({
    title: "Something went wrong!",
    message: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    // Trusted Error
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: error.status,
        msg: err.message
      });
    }

    // LOG ERROR AND SEND GENERIC MESSAGE
    console.log("ERROR ☣️: ", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong"
    });
  }

  // RENDER WEBISTE
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      title: "Something went wrong",
      msg: "Please try again later"
    });
  }

  // LOG ERROR AND SEND GENERIC MESSAGE
  console.log("ERROR ☣️: ", err);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong"
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    console.log(error);

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    sendErrorProd(err, req, res);
  }
};
