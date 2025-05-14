import { StatusCodes } from "http-status-codes";
import responseData from "../../../Shared/responseData";
import catchAsync from "../../../Shared/catchAsync";
import { Request, Response } from "express";
import { PrescriptionService } from "./prescription.service";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../Shared/pick";
import { prescriptionFilterableFields } from "./prescription.constant";

const createPrescription = catchAsync(async (req: Request, res: Response) => {
  const result = await PrescriptionService.createPrescription(
    req.user as IAuthUser,
    req.body
  );
  responseData(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Prescription created successfully",
    data: result,
  });
});
const patientPrescription = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await PrescriptionService.patientPrescription(
    req.user as IAuthUser,
    options
  );
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Get my prescription successfully",
    data: result,
  });
});
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, prescriptionFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await PrescriptionService.getAllFromDB(filters, options);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Prescriptions retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});
export const PrescriptionController = {
  createPrescription,
  patientPrescription,
  getAllFromDB,
};
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA0YmFhZDg5LWY3YzMtNGU3My04ZTA2LTc3OTczMDhlZTQzYiIsImVtYWlsIjoia29sbG9sQGdtYWlsLmNvbSIsInJvbGUiOiJQQVRJRU5UIiwiaWF0IjoxNzQ3MTA5MjY0LCJleHAiOjE3NDkyNjkyNjR9.XEMWiZvkLxnb_EviLPmpN91cL0Pc4Y-PNFzlREaNoFU
