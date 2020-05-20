import moment from "moment";

import Employee from "../../models/users/employeeModel";
import Scheduled from "../../models/shift/scheduledModel";
import IScheduled from "../../types/shift/scheduledInterface";
import Shift from "../../models/shift/shiftModel";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import APIFeatures from "../../utils/apiFeatures";
import AppError from "../../utils/appError";
import IShift from "../../types/shift/shiftInterface";

//----------------------FOR SCHEDULER USE

//TOOLS----------------------------------------------------------

//ENSURE SHIFT DAY AND SCHEDULED DATE DAY MATCHES
export const validateScheduled = catchAsync(async (req, res, next) => {
  //1. GRAB RAW SHIFT FROM ENTERED SHIFT ID
  const shift = await Shift.findById(req.body.shift);

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

  //4. THROW ERROR IF DAYS DON'T MATCH
  if (day !== dateDay) {
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

//CREATE A BUNCH OF WEEKLY SHIFT REFS FOR ON-CALL EMPLOYEES
export const populateSteadyExtra = catchAsync(async (req, res, next) => {
  const blankShifts = await Shift.find();
  const allTheScheduledEver = await Scheduled.find();

  //----A. SET UP VARS FOR WEEKLY SHIFT REF
  //1. FIND FULL-TIME SCHEDULED BY FILTERING THOSE AFTER THE SCHEDULED SUNDAY
  const comingMonday = moment().add(2, "w").isoWeekday(-1);
  const scheduledWeek = [...allTheScheduledEver].filter(
    (scheduled) => moment(scheduled.date) >= comingMonday
  );

  //2. FIND SHIFTS TO FILL BY FILTERING THE ALREADY SCHEDULED ONES FROM ALL SHIFTS
  const scheduledShifts = scheduledWeek.map((scheduled) => scheduled.shift.id);
  const shiftsToFill = [...blankShifts].filter(
    (shift) => !scheduledShifts.includes(shift.id)
  );
  shiftsToFill.sort((x, y) => x.shiftStart[0] - y.shiftStart[0]);

  //3. ARR IS A BUNCH OF SHIFTS ARRS, ONE FOR EACH DAY (MON[], TUE[], WED[], ETC.)
  let sortedShiftsToFill: any[] = [[], [], [], [], [], [], []];
  shiftsToFill.forEach((shift) => {
    sortedShiftsToFill[shift.day].push(shift);
  });

  //----B. CREATE THE WEEKLY SHIFT REFS
  //1. CREATE WEEKLY SHIFT REFS FOR EASIER SCHEDULED ALLOCATION
  //   GOAL TO CREATE MULTIPLE ARRS OF 5 SHIFTS
  let weeklyShiftRefs: IShift[][] = [];

  //2. USE RECURSION TO BE ABLE TO STOP EVERY CREATED ARR WITH 5 SHIFTS
  const shiftFillerRecursion = () => {
    //2a. CREATE NEW ARR PER RECURSION IF THERE ARE SHIFTS AVAILABLE
    //    GOAL IS TO PUT 5 SHIFTS PER ARR
    if (sortedShiftsToFill.length > 1) weeklyShiftRefs.push(new Array());

    //2b. RESET COUNTER BEFORE NEXT LOOP
    let counter = 0;

    //2c. LOOP THROUGH EACH SUN, MON, TUE, ETC. ARR
    sortedShiftsToFill.forEach((dayArr: IShift[]) => {
      //2c.1 DELETE THE DAY ARR IF NO MORE SHIFTS
      if (dayArr.length === 0) return sortedShiftsToFill.shift();

      //2c.2 DO NOT CONTINUE IF 5 SHIFTS HAVE BEEN ADDED
      counter++;
      if (counter > 5) return;

      //2c.3 PLUG IN SHIFT TO THE LATEST ARR
      const latestIndex = weeklyShiftRefs.length - 1;
      weeklyShiftRefs[latestIndex].push(dayArr[0]);

      //2c.4 DELETE THE SHIFT THAT WAS JUST ADDED
      dayArr.shift();
    });

    //2d. RECURSION STOPPER - WHEN sortedShiftsToFill HAS BEEN EMPTIED BY 2c.1
    if (sortedShiftsToFill.length === 0) return;

    shiftFillerRecursion();
  };

  //3. EXECUTE RECURSION
  shiftFillerRecursion();

  console.log(weeklyShiftRefs.sort((x, y) => y.length - x.length));

  //GRAB ON-CALL EMPLOYEES
  // const steadyExtras = await Employee.find({ status: `on-call` });

  res.status(200).json({
    status: `success`,
  });
});

//GET ALL SCHEDULED SHIFTS OF EMPLOYEE FROM EMPLOYEE ID (ENTERED)
export const getEmployeeSchedule = catchAsync(async (req, res, next) => {
  //1. ADD SEARCH FUNCTIONALITY
  const features = new APIFeatures(
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
  const shift = req.body.shift;
  const employee = req.body.employee;
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
      new AppError(`Last scheduled is in the past. Cannot delete.`, 400)
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
