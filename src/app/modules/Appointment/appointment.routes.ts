import expres from "express";
import { AppointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CreateAppointmentSchema } from "./appointment.validation";
import { validate } from "../../../helper/validation";

const router = expres.Router();
router.get(
  "/my-appointment",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentController.getMyAppointment
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AppointmentController.getAllAppointment
);
router.post(
  "/",
  auth(UserRole.PATIENT),
  validate(CreateAppointmentSchema),
  AppointmentController.createAppointment
);

export const AppointmentRoutes = router;
