import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { specialitiesRoutes } from "../modules/Specialities/specialities.routes";
import { doctorRoutes } from "../modules/Doctor/doctor.routes";
import { patientRoutes } from "../modules/Patient/patient.routes";
import { scheduleRoutes } from "../modules/Schedule/schedule.routes";
import { doctorScheduleRoutes } from "../modules/DoctorSchedule/doctorschedule.routes";
import { AppointmentRoutes } from "../modules/Appointment/appointment.routes";
import { PaymentRoute } from "../modules/Payment/payment.routes";
import { PrescriptionRoute } from "../modules/Prescription/prescription.routes";
import { ReviewRoute } from "../modules/Review/review.routes";
import { MetaRoutes } from "../modules/Meta/meta.routes";

const router = express.Router();
const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/specialities",
    route: specialitiesRoutes,
  },
  {
    path: "/doctors",
    route: doctorRoutes,
  },
  {
    path: "/patient",
    route: patientRoutes,
  },
  {
    path: "/schedule",
    route: scheduleRoutes,
  },
  {
    path: "/doctor-schedule",
    route: doctorScheduleRoutes,
  },
  {
    path: "/appointment",
    route: AppointmentRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoute,
  },
  {
    path: "/prescription",
    route: PrescriptionRoute,
  },
  {
    path: "/review",
    route: ReviewRoute,
  },
  {
    path: "/meta",
    route: MetaRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
