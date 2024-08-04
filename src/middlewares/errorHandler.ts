import { Request, Response, NextFunction } from "express";
import { Logger } from "../utils/logger";

const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.error(err.message, { stack: err.stack });
  res.status(500).json({
    message: "Internal Server Error",
  });
};

export default errorHandlerMiddleware;
