import { Request, Response } from "express";
import catchAsync from "../../../Shared/catchAsync";
import { doctorScheduleService } from "./doctorschedule.service";
import responseData from "../../../Shared/responseData";
import { StatusCodes } from "http-status-codes";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../Shared/pick";
import { scheduleFilterableFields } from "./doctorschedule.constant";

const createDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await doctorScheduleService.createDoctorSchedule(
    user as IAuthUser,
    req.body
  );
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor schedules created successfully",
    data: result,
  });
});
const getDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const schedule = await doctorScheduleService.getDoctorSchedule(
    filters,
    options
  );
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor schedule data get successfully",
    data: schedule,
  });
});
const deleteDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const schedule = await doctorScheduleService.deleteDoctorSchedule(
    user as IAuthUser,
    id
  );
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor schedule data deleted successfully",
    data: schedule,
  });
});
const getAllDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, scheduleFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const schedule = await doctorScheduleService.getAllDoctorSchedule(
    filters,
    options
  );

  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Alldoctors schedule data get successfully",
    data: schedule,
  });
});
export const doctorScheduleController = {
  createDoctorSchedule,
  getDoctorSchedule,
  deleteDoctorSchedule,
  getAllDoctorSchedule,
};
