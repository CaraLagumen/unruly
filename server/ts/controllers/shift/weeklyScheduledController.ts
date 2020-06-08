import moment from "moment";
import momentTimezone from "moment-timezone";
momentTimezone.tz.setDefault(`UTC`);

import IEmployee from "../../types/users/employeeInterface";
import WeeklyScheduled from "../../models/shift/weeklyScheduledModel";
import WeeklyShift from "../../models/shift/weeklyShiftModel";
import IWeeklyShift from "../../types/shift/weeklyShiftInterface";
import Scheduled from "../../models/shift/scheduledModel";
import {
  IScheduled,
  IScheduledData,
} from "../../types/shift/scheduledInterface";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";
import { comingWeek, startSchedule } from "../../utils/times";

//----------------------FOR SCHEDULER USE

//TOOLS----------------------------------------------------------

//GET LOGGED IN SCHEDULER
export const getScheduler = catchAsync(async (req, res, next) => {
  req.body.scheduler = req.scheduler.id;
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
  const lastScheduled = await Scheduled.findOne({
    createdAt: latestScheduledDate.toDate(),
  });

  //4. FIND IF LAST SCHEDULED HAS A STEADY EXTRA EMPLOYEE
  const lastScheduledEmployee = lastScheduled?.employee as IEmployee;

  //5. THROW ERROR IF FOUND A STEADY EXTRA WORKING IN THE COMING WEEK
  if (lastScheduledEmployee)
    if (lastScheduledEmployee.status === `on-call`)
      return next(
        new AppError(
          `Found a steady extra working for the coming week. Full-time should be populated first. Cannot populate.`,
          400
        )
      );

  //3. FIND IF LAST SCHEDULED IS IN A WEEKLY SCHEDULED
  const weeklyShift = (await WeeklyShift.findOne({
    $or: [
      { shiftDay1: lastScheduled?.shift },
      { shiftDay2: lastScheduled?.shift },
      { shiftDay3: lastScheduled?.shift },
      { shiftDay4: lastScheduled?.shift },
      { shiftDay5: lastScheduled?.shift },
    ],
  })) as IWeeklyShift;

  if (weeklyShift) {
    const weeklyScheduledRef = await WeeklyScheduled.findOne({ weeklyShift });

    //4. THROW ERR IF THERE IS ONE & THE DATE IS IN THE COMING WEEK
    if (weeklyScheduledRef && moment(lastScheduled?.date) > comingWeek) {
      return next(
        new AppError(
          `Found a weekly scheduled filled for the coming week. Cannot populate.`,
          400
        )
      );
    }
  }

  next();
});

//MAIN----------------------------------------------------------

//CREATE ALL INDIVIDUAL SCHEDULED FROM WEEKLY SCHEDULED IDS
export const populateAllToScheduled = catchAsync(async (req, res, next) => {
  //1. GRAB WHAT WE CAN FROM AVAILABLE
  const allWeeklyScheduled = await WeeklyScheduled.find();
  const scheduler = req.scheduler.id;
  const allScheduled: IScheduledData[][] = [];

  for await (let el of allWeeklyScheduled) {
    //2. GRAB RAW WEEKLY SCHEDULED FROM PARAM ID TO EXTRACT
    //   WEEKLY SHIFT THEN INDIVIDUAL SHIFTS
    const weeklyShift = await WeeklyShift.findById(el.weeklyShift);

    const shifts = [
      weeklyShift?.shiftDay1,
      weeklyShift?.shiftDay2,
      weeklyShift?.shiftDay3,
      weeklyShift?.shiftDay4,
      weeklyShift?.shiftDay5,
    ];

    //3. CREATE ARR WITH DATES TO LOOP INTO WHEN CREATING DOC
    const dates: Date[] = [];

    shifts.forEach((el: any) => {
      //EXTRACT DAYS FROM SHIFT (MON, TUES, ETC...)
      const shiftDay = el.day;
      //FROM THAT MONDAY, ADD SHIFT DAY TO MATCH
      const comingShiftDay = startSchedule
        .clone()
        .isoWeekday(shiftDay)
        .toDate();
      dates.push(comingShiftDay);
    });

    //4. CREATE ARR WITH SCHEDULED TO REPRESENT INDIVIDUAL DOC
    const scheduled: IScheduledData[] = [];

    for (let i = 0; i < shifts.length; i++) {
      //5. VALIDATE INDIVIDUAL SHIFTS BEFORE PUSH
      //   ENSURE SHIFT DAY AND SCHEDULED DATE DAY MATCHES
      if (shifts[i]?.day !== dates[i].getUTCDay()) {
        return next(
          new AppError(
            `Weekly shift is flawed. A shift day and scheduled date day did not match.`,
            400
          )
        );
      }

      scheduled.push({
        //ALL SCHEDULED MUST HAVE { shift, employee, scheduler, date }
        shift: shifts[i]?.id as string,
        employee: el?.employee.id as string,
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

  //2. GRAB RAW WEEKLY SCHEDULED FROM PARAM ID TO EXTRACT WEEKLY SHIFT THEN INDIVIDUAL SHIFTS
  const weeklyScheduled = await WeeklyScheduled.findById(req.params.id);
  const weeklyShift = await WeeklyShift.findById(weeklyScheduled?.weeklyShift);

  const shifts = [
    weeklyShift?.shiftDay1,
    weeklyShift?.shiftDay2,
    weeklyShift?.shiftDay3,
    weeklyShift?.shiftDay4,
    weeklyShift?.shiftDay5,
  ];

  //3. CREATE ARR WITH DATES TO LOOP INTO WHEN CREATING DOC
  const dates: Date[] = [];

  shifts.forEach((el: any) => {
    //EXTRACT DAYS FROM SHIFT (MON, TUES, ETC...)
    const shiftDay = el.day;
    //FROM THAT MONDAY, ADD SHIFT DAY TO MATCH
    const comingShiftDay = startSchedule.clone().isoWeekday(shiftDay).toDate();
    dates.push(comingShiftDay);
  });

  //4. CREATE ARR WITH SCHEDULED TO REPRESENT INDIVIDUAL DOC
  const scheduled: IScheduledData[] = [];

  //5. VALIDATE INDIVIDUAL SHIFTS BEFORE PUSH
  //   ENSURE SHIFT DAY AND SCHEDULED DATE DAY MATCHES
  for (let i = 0; i < shifts.length; i++) {
    if (shifts[i]?.day !== dates[i].getUTCDay()) {
      return next(
        new AppError(
          `Weekly shift is flawed. A shift day and scheduled date day did not match.`,
          400
        )
      );
    }

    scheduled.push({
      //SCHEDULEDS MUST HAVE { shift, employee, scheduler, date }
      shift: shifts[i]?.id as string,
      employee: weeklyScheduled?.employee.id as string,
      scheduler,
      date: dates[i],
    });
  }

  //6. CREATE DOC FROM INDIVIDUAL SCHEDULED
  const doc = await Scheduled.create<IScheduledData[]>(scheduled);

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
