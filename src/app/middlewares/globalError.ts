// import { NextFunction, Request, Response } from "express";
// import { StatusCodes } from "http-status-codes";

// const globalError = (
//   err: any,
//   _req: Request,
//   res: Response,
//   _next: NextFunction
// ) => {
//   const statusCode =
//     err.statusCode || err.status || StatusCodes.INTERNAL_SERVER_ERROR;
//   res.status(statusCode).json({
//     success: false,
//     message: err?.message || "something went wrong",
//     error: err,
//   });
// };

// export default globalError;
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";

const globalError = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";

  // Handle Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        // Unique constraint failed
        statusCode = StatusCodes.CONFLICT;
        const target = err.meta?.target as string[] | undefined;
        message = target
          ? `Duplicate field value : ${target.join(" , ")}`
          : "Duplicate field value";
        break;
      case "P2025":
        // Record not found
        statusCode = StatusCodes.NOT_FOUND;
        message = "Record not found";
        break;
      default:
        message = err.message;
    }
  }

  // Handle Prisma validation errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = err.message;
  }

  // Handle Prisma initialization errors
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    message = "Database connection failed";
  }

  // Fallback: If custom status/message is provided
  else {
    statusCode = err.statusCode || err.status || statusCode;
    message = err.message || message;
  }

  // Final response
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err : undefined,
  });
};

export default globalError;
