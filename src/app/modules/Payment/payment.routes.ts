import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();
router.get("/ipn", PaymentController.validatePayment);
router.post("/init-payment/:id", PaymentController.initiatePayment);
export const PaymentRoute = router;
