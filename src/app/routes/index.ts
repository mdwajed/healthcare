import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { specialitiesRoutes } from "../modules/Specialities/specialities.routes";
import { doctorRoutes } from "../modules/Doctor/doctor.routes";

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
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
