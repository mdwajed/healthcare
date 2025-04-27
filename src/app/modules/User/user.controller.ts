import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../Shared/catchAsync";
import responseData from "../../../Shared/responseData";
import { StatusCodes } from "http-status-codes";
import pick from "../../../Shared/pick";
import { userFilterableField } from "./user.constant";
import { IUser } from "../../interfaces/file.type";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const admin = await userService.createAdmin(req);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin created successfully",
    data: admin,
  });
});
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctor = await userService.createDoctor(req);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor created successfully",
    data: doctor,
  });
});
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const patient = await userService.createPatient(req);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient created successfully",
    data: patient,
  });
});

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableField);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  console.log(options);
  const result = await userService.getAllAdmin(filters, options);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All admin get successfully",
    meta: result.meta,
    data: result.data,
  });
});
const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.changeProfileStatus(req.params.id, req.body);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User profile status changed successfully",
    data: result,
  });
});
const getMyProfile = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    const result = await userService.getMyProfile(user as IUser);
    responseData(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Get my profile data successfully",
      data: result,
    });
  }
);
const updateMyProfile = catchAsync(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    const result = await userService.updateMyProfile(user as IUser, req);
    responseData(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Update my profile data successfully",
      data: result,
    });
  }
);
export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllAdmin,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
