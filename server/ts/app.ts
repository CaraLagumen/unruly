// @ts-nocheck
const path = require(`path`);
const dotenv = require(`dotenv`);
const express = require(`express`);
const morgan = require(`morgan`);
const rateLimit = require(`express-rate-limit`);
const helmet = require(`helmet`);
const cors = require(`cors`);
const cookieParser = require(`cookie-parser`);
const mongoSanitize = require(`express-mongo-sanitize`);
const xss = require(`xss-clean`);
const compression = require(`compression`);

const globalErrorHandler = require(`./controllers/errorController`);
const AppError = require(`./utils/appError`);

dotenv.config({ path: path.join(__dirname, `../../config.env`) });
const app = express();

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
console.log(process.env.NODE_ENV);
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
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

//SETUP BUILD PATH
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../../dist/unruly/index.html"));
});

module.exports = app;
