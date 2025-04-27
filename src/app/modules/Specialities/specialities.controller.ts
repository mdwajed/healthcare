import catchAsync from "../../../Shared/catchAsync";
import { Request, Response } from "express";
import responseData from "../../../Shared/responseData";
import { StatusCodes } from "http-status-codes";
import { specialitiesService } from "./specialities.service";
const createSpecialities = catchAsync(async (req: Request, res: Response) => {
  const result = await specialitiesService.createSpecialities(req);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Create doctor specialist data successfully",
    data: result,
  });
});
const getAllSpecialist = catchAsync(async (req: Request, res: Response) => {
  const result = await specialitiesService.getAllSpecialist();
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Get specialist data successfully",
    data: result,
  });
});
const deleteSpecialist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await specialitiesService.deleteSpecialist(id);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: " Specialist deleted successfully",
    data: null,
  });
});
export const specialistController = {
  createSpecialities,
  getAllSpecialist,
  deleteSpecialist,
};
