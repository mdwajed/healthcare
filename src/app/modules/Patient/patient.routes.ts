import express from "express";
import { patientController } from "./patient.controller";

const router = express.Router();

router.get("/", patientController.getAllPatient);
router.get("/:id", patientController.getPatientById);
router.patch("/:id", patientController.updatePatient);
router.delete("/:id", patientController.deletePatient);
router.delete("/soft/:id", patientController.patientSoftDelete);
export const patientRoutes = router;
