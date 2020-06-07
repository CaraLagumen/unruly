import moment from "moment";

import Employee from "../../models/users/employeeModel";
import IEmployee from "ts/types/users/employeeInterface";
import Scheduled from "../../models/shift/scheduledModel";
import {
  IScheduled,
  IScheduledData,
} from "../../types/shift/scheduledInterface";
import Shift from "../../models/shift/shiftModel";
import IShift from "../../types/shift/shiftInterface";
import Vacation from "../../models/shift/vacationModel";
import IVacation from "ts/types/shift/vacationInterface";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import APIFeatures from "../../utils/apiFeatures";
import AppError from "../../utils/appError";

//----------------------FOR SCHEDULER USE

//TOOLS----------------------------------------------------------

//ENSURE SHIFT DAY AND SCHEDULED DATE DAY MATCHES
export const validateScheduled = catchAsync(async (req, res, next) => {
  //1. GRAB RAW SHIFT FROM ENTERED SHIFT ID
  const shift = await Shift.findById(req.body.shift);

  //2. SETUP VARS FOR DAYS COMPARISON
  const day: number = shift!.day;
  const date: Date = req.body.date;
  const dateDay = moment(date, "YYYY-MM-DD").weekday();

  //3. ERROR IF DATE IS IN THE PAST OR THIS COMING WEEK
  if (moment(date) <= moment().add(2, "w").startOf("w")) {
    return next(
      new AppError(
        `Scheduled date is in the past or this coming week. Please enter a date in the future.`,
        400
      )
    );
  }

  //4. ERROR IF DAYS DON'T MATCH
  if (day !== dateDay) {
    return next(
      new AppError(
        `Shift day and scheduled date day do not match. Please enter a date that matches the shift day.`,
        400
      )
    );
  }

  //5. ERROR IF EMPLOYEE ON VACATION
  const employeeVacations = await Vacation.find({
    employee: req.body.employee,
  });
  const matchingDate: IVacation | undefined = employeeVacations.find(
    (vacation) =>
      moment(vacation.date).format("LL") === moment(date).format("LL")
  );

  if (matchingDate) {
    if (matchingDate.approved === true) {
      return next(
        new AppError(
          `Employee has an approved vacation day for this day. Please set another employee for this shift.`,
          400
        )
      );
    }
  }

  //6. ALLOW WHEN ALL VALIDATED
  next();
});

//DON'T DELETE IF DATE IN THE PAST
export const validateDelete = catchAsync(async (req, res, next) => {
  const scheduled = await Scheduled.findById(req.params.id);

  if (moment(scheduled?.date) < moment().add(2, "w").startOf("w")) {
    return next(
      new AppError(
        `Scheduled date is in the past or this coming week. Cannot delete.`,
        400
      )
    );
  }

  next();
});

//ENSURE POPULATE IS ON A NEW WEEK
export const validatePopulate = catchAsync(async (req, res, next) => {
  //1. GRAB ALL RAW SCHEDULED
  const scheduled = await Scheduled.find();

  //2. CREATE AN ARR OF DATES FROM ALL SCHEDULED AND GRAB THE LATEST SCHEDULED
  const scheduledDates = scheduled.map((scheduled: IScheduled) =>
    moment(scheduled.createdAt)
  );
  const latestScheduledDate = moment.max(scheduledDates);
  const lastScheduled = await Scheduled.find({
    createdAt: latestScheduledDate.toDate(),
  });

  //3. ONLY CONTINUE VALIDATION IF LAST SCHEDULED IS IN THE COMING WEEK
  const weekAhead = 2; //WEEK TO SCHEDULE
  const comingSunday = moment().add(weekAhead, "w").startOf("w");

  if (moment(lastScheduled[0].date) > comingSunday) {
    //4. FIND IF ANY OF LAST SCHEDULED HAS A STEADY EXTRA EMPLOYEE
    const lastScheduledEmployees = lastScheduled.map(
      (scheduled: IScheduled) => scheduled.employee
    ) as IEmployee[];

    const steadyExtra = lastScheduledEmployees.find(
      (employee: IEmployee) => employee.status === `on-call`
    );

    //5. THROW ERROR IF FOUND A STEADY EXTRA WORKING IN THE COMING WEEK
    if (steadyExtra)
      return next(
        new AppError(
          `Found a steady extra working for the coming week. Cannot populate.`,
          400
        )
      );
  }

  next();
});

//MAIN----------------------------------------------------------

//CREATE A BUNCH OF WEEKLY SHIFT REFS FOR ON-CALL EMPLOYEES
export const populateSteadyExtra = catchAsync(async (req, res, next) => {
  const blankShifts = await Shift.find();
  const allTheScheduledEver = await Scheduled.find();
  const scheduler: string = req.scheduler.id;
  const weekAhead = 2; //WEEK TO SCHEDULE

  //----A. SET UP VARS FOR WEEKLY SHIFT REF

  //1. FIND FULL-TIME SCHEDULED BY FILTERING THOSE AFTER THE SCHEDULED SUNDAY
  const comingSunday = moment().add(weekAhead, "w").startOf("w");
  const scheduledWeek = [...allTheScheduledEver].filter(
    (scheduled) => moment(scheduled.date) >= comingSunday
  );

  //2. FIND SHIFTS TO FILL BY FILTERING THE ALREADY SCHEDULED ONES FROM ALL SHIFTS
  const scheduledShifts = scheduledWeek.map((scheduled) => scheduled.shift.id);
  const shiftsToFill = [...blankShifts].filter(
    (shift) => !scheduledShifts.includes(shift.id)
  );
  shiftsToFill.sort((x, y) => x.shiftStart[0] - y.shiftStart[0]);

  if (!shiftsToFill.length) {
    return next(
      new AppError(
        `All shifts have already been filled for coming week. Cannot populate.`,
        400
      )
    );
  }

  //3. CREATE A BUNCH OF SHIFTS ARRS, ONE FOR EACH DAY (MON[], TUE[], WED[], ETC.)
  const sortedShiftsToFill: IShift[][] = [[], [], [], [], [], [], []];
  shiftsToFill.forEach((shift) => {
    sortedShiftsToFill[shift.day].push(shift);
  });

  //4. PREPARE ARR TO START WITH THE DAY WITH MOST SHIFTS
  sortedShiftsToFill.sort((x, y) => y.length - x.length);

  //----B. CREATE SCHEDULEDS FROM SHIFTS TO FILL AND ON-CALL EMPLOYEES

  //1. GRAB ON-CALL EMPLOYEES AND SORT BY SENIORITY
  const steadyExtras = await Employee.find({ status: `on-call` });
  steadyExtras.sort((x, y) => x.seniority - y.seniority);

  //2. PREPARE VARS FOR SCHEDULED CREATION
  const allScheduled: IScheduledData[] = [];
  let employeeIndex = 0;
  let employeeShiftsCounter: number[] = new Array(steadyExtras.length).fill(0);

  //3. USE RECURSION TO MANIPULATE EMPLOYEES TO ONLY HAVE 5 SHIFTS OR LESS
  const allScheduledFiller = () => {
    //3a. GO THROUGH EACH DAY ARR [MON[], TUE[], WED[], ETC.] AND ASSIGN FIRST SHIFT
    sortedShiftsToFill.forEach((shiftsOfTheDay) => {
      const employee = steadyExtras[employeeIndex];

      //3a.1 CONDITIONS TO START
      //     NO MORE SHIFTS, END LOOP
      if (shiftsOfTheDay.length === 0) return;
      //     ALL EMPLOYEES HAVE 5 SHIFTS, END RECURSION
      if (employeeShiftsCounter[employeeShiftsCounter.length - 1] === 5) return;

      //3a.2 CONDITION TO CONTINUE IF EMPLOYEE HASN'T MET 5 SHIFTS YET
      if (employeeShiftsCounter[employeeIndex] < 5) {
        //   FIND OUT DATE FOR THE SHIFT AND PARSE IT
        const firstShiftOfTheDay = shiftsOfTheDay[0];
        const comingMonday = moment().add(weekAhead, "w").isoWeekday(1);
        const parsedDate = comingMonday
          .isoWeekday(firstShiftOfTheDay.day)
          .toDate();

        //   ASSEMBLE SCHEDULED AND ADD TO WHAT WILL BE THE DOC
        allScheduled.push({
          shift: firstShiftOfTheDay.id as string,
          employee: employee.id as string,
          scheduler,
          date: parsedDate,
        });

        //   COUNT SHIFT THAT WAS SCHEDULED FOR EMPLOYEE
        employeeShiftsCounter[employeeIndex]++;
        //   DELETE SHIFT ALREADY SCHEDULED
        shiftsOfTheDay.shift();
      } else {
        return;
      }

      //3a.3 CONDITIONS TO END
      //     EMPLOYEE ALREADY HAS 5 SHIFTS, RETURN AND GO NEXT EMPLOYEE
      if (employeeShiftsCounter[employeeIndex] === 5) return;
      //     ALL EMPLOYEES HAVE 5 SHIFTS, END RECURSION
      if (employeeShiftsCounter[employeeShiftsCounter.length - 1] === 5) return;
    });

    //3b. MOVE TO NEXT EMPLOYEE ON NEXT LOOP THROUGH DAYS
    if (employeeIndex < steadyExtras.length) employeeIndex++;

    //3c. CONDITION TO CONTINUE
    //    DAY SHIFTS ALL SCHEDULED, DELETE THE DAY ARR
    if (sortedShiftsToFill[0].length === 0) {
      sortedShiftsToFill.shift();
    }

    //3d. CONDITIONS TO END
    //    REACHED LAST EMPLOYEE
    if (employeeShiftsCounter[employeeShiftsCounter.length - 1]) return;
    //    ALL EMPLOYEES HAVE 5 SHIFTS, END RECURSION
    if (employeeShiftsCounter[employeeShiftsCounter.length - 1] === 5) return;
    //    ALL SHIFTS ARE SCHEDULED, END RECURSION
    if (sortedShiftsToFill.length === 0) return;

    //3e. GO THROUGH DAYS LOOP AGAIN
    allScheduledFiller();
  };

  //----C. CREATE ALL SCHEDULED AND SEND

  allScheduledFiller();

  const doc = await Scheduled.insertMany(allScheduled);

  res.status(201).json({
    status: `success`,
    results: allScheduled.length,
    doc,
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
  const doc: IScheduled[] = await features.query;

  //3. SEND DATA
  res.status(200).json({
    status: `success`,
    results: doc.length,
    doc,
  });
});

//CREATE SCHEDULED SHIFT WITH EMPLOYEE FROM SHIFT ID AND EMPLOYEE ID (ENTERED)
export const createScheduled = catchAsync(async (req, res, next) => {
  const shift: string = req.body.shift;
  const employee: string = req.body.employee;
  const scheduler: string = req.scheduler.id;
  const date: Date = req.body.date; //DATE MUST BE IN YYYY-MM-DD ORDER TO VALIDATE

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
  if (moment(lastScheduled?.date) < moment().add(2, "w").startOf("w")) {
    return next(
      new AppError(
        `Last scheduled is in the past or this coming week. Cannot delete.`,
        400
      )
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
