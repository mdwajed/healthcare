import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const globalError = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err?.message || "something went wrong",
    error: err,
  });
};

export default globalError;
