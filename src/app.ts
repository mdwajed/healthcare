import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalError from "./app/middlewares/globalError";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { AppointmentService } from "./app/modules/Appointment/appointment.services";
import cron from "node-cron";
const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cron.schedule("* * * * *", () => {
  try {
    AppointmentService.cancelUnpaidAppointment();
  } catch (error) {
    console.error(error);
  }
});
app.get("/", (_req: Request, res: Response) => {
  res.send({ Message: "Welcome to Healthcare Service" });
});
app.use("/api/v1", router);
app.use(globalError);
app.use(notFound);
export default app;
