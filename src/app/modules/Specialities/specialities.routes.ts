import express, { NextFunction, Request, Response } from "express";

import { specialistController } from "./specialities.controller";
import { fileUploader } from "../../../helper/fileUploader";
import { specialistValidation } from "./specialities.validation";

const router = express.Router();
router.get(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = specialistValidation.createSpecialistValidation.parse(
      JSON.parse(req.body.data)
    );
    return specialistController.getAllSpecialist(req, res, next);
  }
);
router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = specialistValidation.createSpecialistValidation.parse(
      JSON.parse(req.body.data)
    );
    return specialistController.createSpecialities(req, res, next);
  }
);
router.delete(
  "/:id",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = specialistValidation.createSpecialistValidation.parse(
      JSON.parse(req.body.data)
    );
    return specialistController.deleteSpecialist(req, res, next);
  }
);

export const specialitiesRoutes = router;
