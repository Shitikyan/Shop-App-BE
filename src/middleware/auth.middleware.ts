import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../util/constants/env";

interface DecodedToken extends jwt.JwtPayload {
  roles: string[];
}

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    if (err || !decodedToken) {
      res.sendStatus(403);
      return;
    } else {
      const user = decodedToken as DecodedToken;

      req.body.user = user;

      if (user) {
        next();
      } else {
        res.sendStatus(403);
      }
    }
  });
};

export default authenticateToken;
