import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../Shared/catchAsync";
import responseData from "../../../Shared/responseData";
import { AuthServices } from "./auth.services";
import { Request, Response } from "express";

const loggedInUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loggedInUser(req.body);
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User login successfull",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken as string);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "refreshToken get successfull",
    data: result,
  });
});
const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    console.log(user, req.body);
    const result = await AuthServices.changePassword(user, req.body);
    responseData(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "password changed successfully",
      data: result,
    });
  }
);
const forgotPasssword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await AuthServices.forgotPassword(req.body);
    responseData(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Check email",
      data: result,
    });
  }
);
const resetPasssword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";
  await AuthServices.resetPassword(token, req.body);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password  reset successfuly",
    data: null,
  });
});
export const AuthController = {
  loggedInUser,
  refreshToken,
  changePassword,
  forgotPasssword,
  resetPasssword,
};
