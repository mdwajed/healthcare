// import { ZodSchema } from "zod";
// import { NextFunction, Request, Response } from "express";

// export const validate =
//   (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
//     const result = schema.safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json({
//         message: "Validation failed",
//         errors: result.error.errors,
//       });
//     }
//     req.body = result.data;
//     next();
//   };
import { ZodSchema } from "zod";
import { RequestHandler } from "express";

export const validate = (schema: ZodSchema): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: result.error.errors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
};
