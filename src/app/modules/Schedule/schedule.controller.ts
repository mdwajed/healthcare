import { Request, Response } from "express";
import catchAsync from "../../../Shared/catchAsync";
import responseData from "../../../Shared/responseData";
import { StatusCodes } from "http-status-codes";
import { schedulService } from "./schedule.service";
import pick from "../../../Shared/pick";
import { IAuthUser } from "../../interfaces/common";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const schedule = await schedulService.createSchedule(req.body);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Schedules data get successfully",
    data: schedule,
  });
});
const getAllSchedule = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, ["startDate", "endDate"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user;
    const schedule = await schedulService.getAllSchedule(
      filters,
      options,
      user as IAuthUser
    );
    responseData(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Schedule data get successfully",
      data: schedule,
    });
  }
);
const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const schedule = await schedulService.getScheduleById(req.params.id);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Schedule data get successfully",
    data: schedule,
  });
});
const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const schedule = await schedulService.deleteSchedule(req.params.id);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Delete schedule data successfully",
    data: schedule,
  });
});
export const scheduleController = {
  createSchedule,
  getAllSchedule,
  getScheduleById,
  deleteSchedule,
};
