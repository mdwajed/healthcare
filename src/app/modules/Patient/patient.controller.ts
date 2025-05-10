import { Request, Response } from "express";
import catchAsync from "../../../Shared/catchAsync";
import { patientFilterableFields } from "./patient.constant";
import pick from "../../../Shared/pick";
import { patientService } from "./patient.service";
import responseData from "../../../Shared/responseData";
import { StatusCodes } from "http-status-codes";

const getAllPatient = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  console.log(options);
  const result = await patientService.getAllPaient(filters, options);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patients data get successfully",
    data: result,
  });
});

const getPatientById = catchAsync(async (req: Request, res: Response) => {
  const patient = await patientService.getPatientById(req.params.id);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient data get successfully",
    data: patient,
  });
});
const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const patient = await patientService.updatePatient(req.params.id, req.body);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient data updated successfully",
    data: patient,
  });
});
const deletePatient = catchAsync(async (req: Request, res: Response) => {
  await patientService.deletePatient(req.params.id);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient data deleted successfully",
    data: null,
  });
});
const patientSoftDelete = catchAsync(async (req: Request, res: Response) => {
  await patientService.patientSoftDelete(req.params.id);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient and associated user data soft deleted successfully",
    data: null,
  });
});
export const patientController = {
  getAllPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  patientSoftDelete,
};
