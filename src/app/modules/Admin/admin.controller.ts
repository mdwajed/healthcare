import { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../Shared/pick";
import { adminFilterableField } from "./admin.constant";
import responseData from "../../../Shared/responseData";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../Shared/catchAsync";

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterableField);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  console.log(options);
  const result = await adminService.getAllAdmin(filters, options);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All admin get successfully",
    meta: result.meta,
    data: result.data,
  });
});
const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.getAdminById(id);
  responseData(res, {
    statusCode: 200,
    success: true,
    message: "Admin get by id successfully",
    data: result,
  });
});
const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.updateAdmin(id, req.body);
  responseData(res, {
    statusCode: 200,
    success: true,
    message: "Admin update successfully",
    data: result,
  });
});
const adminDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminService.adminDelete(id);
  responseData(res, {
    statusCode: 200,
    success: true,
    message: "Admin delete successfully",
    data: result,
  });
});
const adminSoftDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminService.adminSoftDelete(id);
  responseData(res, {
    statusCode: 200,
    success: true,
    message: "Admin soft delete successfully",
    data: result,
  });
});
export const adminController = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  adminDelete,
  adminSoftDelete,
};
