import { z } from "zod";

export const AppointmentStatusEnum = z.enum([
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "INPROGRESS",
]);
export const PaymentStatusEnum = z.enum(["UNPAID", "PAID"]);

export const CreateAppointmentSchema = z.object({
  doctorId: z.string().uuid(),
  scheduleId: z.string().uuid(),
  status: AppointmentStatusEnum.optional(),
  paymentStatus: PaymentStatusEnum.optional(),
});
