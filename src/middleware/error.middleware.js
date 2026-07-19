import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (!(err instanceof ApiError)) {
    err = new ApiError(500, err.message || "Internal Server Error");
  }

  return res.status(err.statusCode).json({
    success: err.success,
    message: err.message,
    errors: err.errors,
    data: err.data,
  });
};

export default errorHandler;
