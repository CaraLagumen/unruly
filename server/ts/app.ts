import path from "path";
import dotenv from "dotenv";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
//@ts-ignore
import xss from "xss-clean";
import compression from "compression";

import globalErrorHandler from "./controllers/errorController";
import AppError from "./utils/appError";

const shiftRouter = require(`./routes/shift/shiftRoutes`);

dotenv.config({ path: path.join(__dirname, `../../config.env`) });
const app: Application = express();

//TRUST HEROKU
app.enable(`trust proxy`);

//SERVE STATIC FILES
app.use("/", express.static(path.join(__dirname, "../../dist/unruly")));

//ENABLE OUTSIDE API USAGE
app.use(cors());
app.options("*", cors());

//SET HTTP SECURITY HEADERS
app.use(helmet());

//DEV LOGS
console.log(`Server on ${process.env.NODE_ENV} mode.`);
if (process.env.NODE_ENV === `development`) {
  app.use(morgan(`dev`));
}

//BODY PARSER
app.use(express.json({ limit: `10kb` }));
//URL PARSER
app.use(express.urlencoded({ extended: true, limit: `10kb` }));
//COOKIE PARSER
app.use(cookieParser());

//LIMIT API REQUESTS
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: `---Too many requests from this IP, try again in an hour.`,
});
app.use("/api", limiter);

//DATA SECURITY
app.use(mongoSanitize());
app.use(xss());

//COMPRESS FILES
app.use(compression());

//HANDLE ERRORS
app.use(globalErrorHandler);

//MOUNT ROUTERS
app.use(`/api/v1/shifts`, shiftRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

//SETUP BUILD PATH
app.use((req: Request, res: Response, next: NextFunction) => {
  res.sendFile(path.join(__dirname, "../../dist/unruly/index.html"));
});

module.exports = app;
