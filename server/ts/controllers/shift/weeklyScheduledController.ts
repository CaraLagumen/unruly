import moment from "moment";

import WeeklyScheduled from "../../models/shift/weeklyScheduledModel";
import WeeklyShift from "../../models/shift/weeklyShiftModel";
import Scheduled from "../../models/shift/scheduledModel";
import { IScheduledData } from "../../types/shift/scheduledInterface";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";

//----------------------FOR SCHEDULER USE

//TOOLS----------------------------------------------------------

//GET LOGGED IN SCHEDULER
export const getScheduler = catchAsync((req, res, next) => {
  req.body.scheduler = req.scheduler.id;
  next();
});

//MAIN----------------------------------------------------------

//CREATE ALL INDIVIDUAL SCHEDULED FROM WEEKLY SCHEDULED IDS
export const populateAllToScheduled = catchAsync(async (req, res, next) => {
  //1. GRAB WHAT WE CAN FROM AVAILABLE
  const allWeeklyScheduled = await WeeklyScheduled.find();
  const scheduler = req.scheduler.id;
  const allScheduled: IScheduledData[][] = [];
  const weekAhead = 2; //WEEK TO SCHEDULE

  for await (let el of allWeeklyScheduled) {
    //2. GRAB RAW WEEKLY SCHEDULED FROM PARAM ID TO EXTRACT
    //   WEEKLY SHIFT THEN INDIVIDUAL SHIFTS
    const weeklyShift = await WeeklyShift.findById(el.weeklyShift);

    const shifts = [
      weeklyShift!.shiftDay1,
      weeklyShift!.shiftDay2,
      weeklyShift!.shiftDay3,
      weeklyShift!.shiftDay4,
      weeklyShift!.shiftDay5,
    ];

    //3. CREATE ARR WITH DATES TO LOOP INTO WHEN CREATING DOC
    const dates: Date[] = [];

    shifts.forEach((el: any) => {
      //EXTRACT DAYS FROM SHIFT (MON, TUES, ETC...)
      const shiftDay = el.day;
      const comingMonday = moment().add(weekAhead, "w").isoWeekday(1);
      //FROM THAT MONDAY, ADD SHIFT DAY TO MATCH
      const comingShiftDay = comingMonday.isoWeekday(shiftDay).toDate();
      dates.push(comingShiftDay);
    });

    //4. CREATE ARR WITH SCHEDULED TO REPRESENT INDIVIDUAL DOC
    const scheduled: IScheduledData[] = [];

    for (let i = 0; i < shifts.length; i++) {
      //5. VALIDATE INDIVIDUAL SHIFTS BEFORE PUSH
      //   ENSURE SHIFT DAY AND SCHEDULED DATE DAY MATCHES
      if (shifts[i]!.day !== dates[i].getDay()) {
        return next(
          new AppError(
            `Weekly shift is flawed. A shift day and scheduled date day did not match.`,
            400
          )
        );
      }

      scheduled.push({
        //ALL SCHEDULED MUST HAVE { shift, employee, scheduler, date }
        shift: shifts[i]!.id as string,
        employee: el!.employee.id as string,
        scheduler,
        date: dates[i],
      });
    }

    allScheduled.push(scheduled);
  }

  //6. CREATE DOC FROM INDIVIDUAL ALL SCHEDULED
  const doc = await Scheduled.insertMany(([] as any[]).concat(...allScheduled));

  res.status(201).json({
    status: `success`,
    results: allScheduled.length,
    doc,
  });
});

//CREATE INDIVIDUAL SCHEDULED FROM WEEKLY SCHEDULED ID (PARAM) / POPULATE ONE FULL-TIME EMPLOYEE
export const populateToScheduled = catchAsync(async (req, res, next) => {
  //1. GRAB WHAT WE CAN FROM AVAILABLE
  const scheduler: string = req.scheduler.id;
  const weekAhead = 2; //WEEK TO SCHEDULE

  //2. GRAB RAW WEEKLY SCHEDULED FROM PARAM ID TO EXTRACT WEEKLY SHIFT THEN INDIVIDUAL SHIFTS
  const weeklyScheduled = await WeeklyScheduled.findById(req.params.id);
  const weeklyShift = await WeeklyShift.findById(weeklyScheduled!.weeklyShift);

  const shifts = [
    weeklyShift!.shiftDay1,
    weeklyShift!.shiftDay2,
    weeklyShift!.shiftDay3,
    weeklyShift!.shiftDay4,
    weeklyShift!.shiftDay5,
  ];

  //3. CREATE ARR WITH DATES TO LOOP INTO WHEN CREATING DOC
  const dates: Date[] = [];

  shifts.forEach((el: any) => {
    //EXTRACT DAYS FROM SHIFT (MON, TUES, ETC...)
    const shiftDay = el.day;
    const comingMonday = moment().add(weekAhead, "w").isoWeekday(1);

    //FROM THAT MONDAY, ADD SHIFT DAY TO MATCH
    const comingShiftDay = comingMonday.isoWeekday(shiftDay);

    dates.push(comingShiftDay.toDate());
  });

  //4. CREATE ARR WITH SCHEDULED TO REPRESENT INDIVIDUAL DOC
  const scheduled: IScheduledData[] = [];

  //5. VALIDATE INDIVIDUAL SHIFTS BEFORE PUSH
  //   ENSURE SHIFT DAY AND SCHEDULED DATE DAY MATCHES
  for (let i = 0; i < shifts.length; i++) {
    if (shifts[i]!.day !== dates[i].getDay()) {
      return next(
        new AppError(
          `Weekly shift is flawed. A shift day and scheduled date day did not match.`,
          400
        )
      );
    }

    scheduled.push({
      //SCHEDULEDS MUST HAVE { shift, employee, scheduler, date }
      shift: shifts[i]!.id as string,
      employee: weeklyScheduled!.employee.id as string,
      scheduler,
      date: dates[i],
    });
  }

  //6. CREATE DOC FROM INDIVIDUAL SCHEDULED
  const doc = await Scheduled.create(scheduled);

  res.status(201).json({
    status: `success`,
    doc,
  });
});

//STANDARD----------------------------------------------------------

export const getAllWeeklyScheduled = factory.getAll(WeeklyScheduled);
export const getWeeklyScheduled = factory.getOne(WeeklyScheduled);
export const createWeeklyScheduled = factory.createOne(WeeklyScheduled);
export const updateWeeklyScheduled = factory.updateOne(WeeklyScheduled);
export const deleteWeeklyScheduled = factory.deleteOne(WeeklyScheduled);
