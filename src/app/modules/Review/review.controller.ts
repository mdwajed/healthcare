import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../Shared/catchAsync";
import { Request, Response } from "express";
import responseData from "../../../Shared/responseData";
import { ReviewService } from "./review.service";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../Shared/pick";
import { reviewFilterableFields } from "./Review.constant";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview(
    req.user as IAuthUser,
    req.body
  );
  responseData(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});
const getAllReview = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await ReviewService.getAllReview(filters, options);
  responseData(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});
export const ReviewController = {
  createReview,
  getAllReview,
};
