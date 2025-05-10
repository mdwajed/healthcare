import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { doctorScheduleController } from "./doctorschedule.controller";

const router = express.Router();
router.get(
  "/my-schedules",
  auth(UserRole.DOCTOR),
  doctorScheduleController.getDoctorSchedule
);
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  doctorScheduleController.getAllDoctorSchedule
);
router.post(
  "/",
  auth(UserRole.DOCTOR),
  doctorScheduleController.createDoctorSchedule
);
router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  doctorScheduleController.deleteDoctorSchedule
);
export const doctorScheduleRoutes = router;
