import catchAsync from "../../../Shared/catchAsync";
import { Request, Response } from "express";
import { MetaService } from "./meta.service";
import { IAuthUser } from "../../interfaces/common";
import responseData from "../../../Shared/responseData";
import { StatusCodes } from "http-status-codes";
const fetchDashboardMetaData = catchAsync(
  async (req: Request, res: Response) => {
    const result = await MetaService.fetchDashboardMetaData(
      req.user as IAuthUser
    );
    responseData(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Meta data get successfully",
      data: result,
    });
  }
);
export const MetaController = {
  fetchDashboardMetaData,
};
