const app = require(`./server/js/app`);
const mongoose = require(`mongoose`);
const dotenv = require(`dotenv`);
const moment = require(`moment-timezone`);

//SETUP TIMEZONE
moment.tz.setDefault(`UTC`);

//SETUP PASSWORD FOR DB
dotenv.config({ path: `./config.env` });
const DB = process.env.DATABASE.replace(
  `<PASSWORD>`,
  process.env.DATABASE_PASSWORD
);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`App running on port ${port}...`)
);

//CONNECT TO DB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`---DB connection successful.`));

//ERROR LOGS
process.on(`uncaughtException`, (err) => {
  console.log(`---Uncaught exception. Shutting down...`);
  console.log(err.name, err.message);
  process.exit(1);
});

process.on(`unhandledRejection`, (err) => {
  console.log(`---Unhandled rejection. Shutting down...`);
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});

process.on(`SIGTERM`, () => {
  console.log(`---SIGTERM RECEIVED. Shutting down gracefully...`);
  server.close(() => console.log(`------Process terminated.`));
});
