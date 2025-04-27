import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalError from "./app/middlewares/globalError";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (_req: Request, res: Response) => {
  res.send({ Message: "Welcome to Healthcare Service" });
});
app.use("/api/v1", router);
app.use(notFound);
app.use(globalError);
export default app;
