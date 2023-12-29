import { Request, Response, NextFunction } from "express";
import { ErrorStatus, ErrorMessage, ErrorMessageKey } from "../util/error/errorMessages";
import logger from "../main";

const errorHandlerMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = ErrorMessage.internalError;
  let statusCode = ErrorStatus.internalError;
  if (ErrorMessage[error.message as ErrorMessageKey]) {
    errorMessage = ErrorMessage[error.message as ErrorMessageKey];
    statusCode = ErrorStatus[error.message as ErrorMessageKey];
  }

  logger.error(errorMessage);
  res.status(statusCode).json({ error: errorMessage });
};

export default errorHandlerMiddleware;
