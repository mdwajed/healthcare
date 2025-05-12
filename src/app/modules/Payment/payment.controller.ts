import { Request, Response } from "express";
import catchAsync from "../../../Shared/catchAsync";
import { StatusCodes } from "http-status-codes";
import responseData from "../../../Shared/responseData";
import { PaymentService } from "./payment.service";

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.initiatePayment(req.params.appointmentId);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment initiate successfully",
    data: result,
  });
});
const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.validatePayment(req.query);
  responseData(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment validate successfully",
    data: result,
  });
});
export const PaymentController = {
  initiatePayment,
  validatePayment,
};
