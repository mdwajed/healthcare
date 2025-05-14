import express from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ReviewController.getAllReview
);
router.post("/", auth(UserRole.PATIENT), ReviewController.createReview);
export const ReviewRoute = router;
