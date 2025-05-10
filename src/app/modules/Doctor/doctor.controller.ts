import { Request, Response } from "express";
import catchAsync from "../../../Shared/catchAsync";
import responseData from "../../../Shared/responseData";
import { StatusCodes } from "http-status-codes";
import { doctorService } from "./doctor.service";
import pick from "../../../Shared/pick";
import { doctorFilterableFields } from "./doctor.constant";

const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  console.log(options);
  const result = await doctorService.getAllDoctor(filters, options);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All doctors get successfully",
    data: result,
  });
});
const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const result = await doctorService.getDoctorById(req.params.id);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Get doctor data successfully",
    data: result,
  });
});
const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  await doctorService.deleteDoctor(req.params.id);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor and associated user deleted successfully",
    data: null,
  });
});
const doctorSoftDelete = catchAsync(async (req: Request, res: Response) => {
  await doctorService.doctorSoftDelete(req.params.id);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor and associated user soft deleted successfully",
    data: null,
  });
});
const doctorUpdate = catchAsync(async (req: Request, res: Response) => {
  const doctor = await doctorService.doctorUpdate(req.params.id, req.body);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor data updated successfully",
    data: doctor,
  });
});

export const doctorController = {
  getAllDoctor,
  getDoctorById,
  deleteDoctor,
  doctorSoftDelete,
  doctorUpdate,
};
