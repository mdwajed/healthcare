import expres from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = expres.Router();
router.post("/login", AuthController.loggedInUser);
router.post("/refresh-token", AuthController.refreshToken);
router.post(
  "/change-password",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  AuthController.changePassword
);
router.post("/forgot-password", AuthController.forgotPasssword);
router.post("/reset-password", AuthController.resetPasssword);
export const AuthRoutes = router;
