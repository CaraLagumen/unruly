import moment from "moment";

import Scheduled from "../../models/shift/scheduledModel";
import IScheduled from "../../types/shift/scheduledInterface";
import Shift from "../../models/shift/shiftModel";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import APIFeatures from "../../utils/apiFeatures";
import AppError from "../../utils/appError";

//----------------------FOR SCHEDULER USE

//TOOLS----------------------------------------------------------

//ENSURE SHIFT DAY AND SCHEDULED DATE DAY MATCHES
export const validateScheduled = catchAsync(async (req, res, next) => {
  //1. GRAB RAW SHIFT FROM ENTERED SHIFT ID
  const shift = await Shift.findById(req.body.shiftId);

  //2. SETUP VARS FOR DAYS COMPARISON
  const today = moment();
  const day = shift!.day;
  const date: Date = req.body.date;
  const dateDay = moment(date, "YYYY-MM-DD").weekday();

  //3. THROW ERROR IF DATE IS IN THE PAST
  if (moment(date) <= today) {
    return next(
      new AppError(
        `Scheduled date is in the past. Please enter a date in the future.`,
        400
      )
    );
  }

  if (day !== dateDay) {
    //4. THROW ERROR IF DAYS DON'T MATCH
    return next(
      new AppError(
        `Shift day and scheduled date day do not match. Please enter a date that matches the shift day.`,
        400
      )
    );
  }

  //5. ALLOW WHEN ALL VALIDATED
  next();
});

//MAIN----------------------------------------------------------

//GET ALL SCHEDULED SHIFTS OF EMPLOYEE FROM EMPLOYEE ID (ENTERED)
export const getEmployeeSchedule = catchAsync(async (req, res, next) => {
  //1. ADD SEARCH FUNCTIONALITY
  const features = new APIFeatures(
    //@ts-ignore
    Scheduled.find({ employee: req.params.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  //2. SET DATA DEPENDING ON QUERIES
  const doc = await features.query;

  //3. SEND DATA
  res.status(200).json({
    status: `success`,
    results: doc.length,
    doc,
  });
});

//CREATE SCHEDULED SHIFT WITH EMPLOYEE FROM SHIFT ID AND EMPLOYEE ID (ENTERED)
export const createScheduled = catchAsync(async (req, res, next) => {
  const shift = req.body.shiftId;
  const employee = req.body.employeeId;
  const scheduler = req.scheduler.id;
  const date = req.body.date; //DATE MUST BE IN YYYY-MM-DD ORDER TO VALIDATE

  const doc = await Scheduled.create({ shift, employee, scheduler, date });

  res.status(201).json({
    status: `success`,
    doc,
  });
});

//DELETE LAST SCHEDULED BY FINDING CREATED BY (CAN DELETE IN BULK)
export const deleteLastScheduled = catchAsync(async (req, res, next) => {
  //1. GRAB ALL RAW SCHEDULED
  const scheduled = await Scheduled.find();

  //2. CREATE AN ARR OF DATES FROM ALL SCHEDULED AND GRAB THE LATEST SCHEDULED
  const scheduledDates = scheduled.map((scheduled: IScheduled) =>
    moment(scheduled.createdAt)
  );
  const latestScheduledDate = moment.max(scheduledDates);
  const lastScheduled = await Scheduled.findOne({
    createdAt: latestScheduledDate.toDate(),
  });

  //3. DON'T DELETE IF LATEST DATE IN THE PAST
  if (moment(lastScheduled?.date) < moment()) {
    return next(
      new AppError(`Last scheduled is in the past. Cannot delete.`, 404)
    );
  }

  //4. DELETE ALL SCHEDULED WITH THE SAME LATEST DATE
  const doc = await Scheduled.deleteMany({
    createdAt: latestScheduledDate.toDate(),
  });

  if (!doc) {
    return next(new AppError(`No documents found.`, 404));
  }

  //5. SEND DATA
  res.status(204).json({
    status: `success`,
    doc: null,
  });
});

//STANDARD----------------------------------------------------------

export const getRawAllScheduled = factory.getRawAll(Scheduled);
export const getAllScheduled = factory.getAll(Scheduled);
export const getScheduled = factory.getOne(Scheduled);
export const deleteScheduled = factory.deleteOne(Scheduled);
