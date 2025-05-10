import express from "express";
import { scheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();
router.get("/", auth(UserRole.DOCTOR), scheduleController.getAllSchedule);
router.get("/:id", auth(UserRole.DOCTOR), scheduleController.getScheduleById);
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  scheduleController.createSchedule
);
router.delete("/:id", auth(UserRole.DOCTOR), scheduleController.deleteSchedule);
export const scheduleRoutes = router;
