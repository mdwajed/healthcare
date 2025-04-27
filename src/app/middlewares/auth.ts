import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import { jwtHelper } from "../../helper/jwtHelper";
import config from "../../config";
import appError from "../errors/appError";
import { StatusCodes } from "http-status-codes";
const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new appError(StatusCodes.UNAUTHORIZED, "You are not authorize");
      }
      const verifiedUser = jwtHelper.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );
      req.user = verifiedUser;
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new Error("You are not authorize");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
export default auth;
