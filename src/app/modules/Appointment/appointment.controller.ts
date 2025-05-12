import catchAsync from "../../../Shared/catchAsync";
import { Request, Response } from "express";
import { AppointmentService } from "./appointment.services";
import responseData from "../../../Shared/responseData";
import { StatusCodes } from "http-status-codes";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../Shared/pick";
import { prisma } from "../../../Shared/prisma";
import { appointmentFilterableFields } from "./appointment.constant";

const createAppointment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await AppointmentService.createAppointment(
    user as IAuthUser,
    req.body
  );
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Create appointment data successfully",
    data: result,
  });
});
const getMyAppointment = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["status", "paymentStatus"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const user = req.user;
  const result = await AppointmentService.getMyAppointment(
    user as IAuthUser,
    filters,
    options
  );
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Get my appointment data successfully",
    data: result,
  });
});
const getAllAppointment = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, appointmentFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await AppointmentService.getAllAppointment(filters, options);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Get all appointments data successfully",
    data: result,
  });
});
const changeAppointmentStatus = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const result = await AppointmentService.changeAppointmentStatus(
      req.params.id,
      user as IAuthUser,
      req.body
    );
    responseData(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Change appointment status successfully",
      data: result,
    });
  }
);
export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  getAllAppointment,
  changeAppointmentStatus,
};
