import ExpressBrute from "express-brute";
import { ErrorMessage } from "../util/error/errorMessages";
import logger from "../main";

const store = new ExpressBrute.MemoryStore();

export const bruteForce = new ExpressBrute(store, {
  freeRetries: 2, // Number of allowed failed attempts before rate limiting kicks in
  minWait: 1000, // Minimum wait time between requests in milliseconds
  maxWait: 60 * 1000, // Maximum wait time between requests in milliseconds
  lifetime: 3600, // Duration of time an IP is banned after too many failed attempts (in seconds)
  failCallback: (req, res, next, nextValidRequestDate) => {
    logger.info(nextValidRequestDate);
    const error = new Error(ErrorMessage.tooManyRequests);
    next(error);
  },
});
