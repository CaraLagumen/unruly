import WeeklyScheduled from "../../models/shift/weeklyScheduledModel";
import WeeklyShift from "../../models/shift/weeklyShiftModel";
import Scheduled from "../../models/shift/scheduledModel";
import Shift from "../../models/shift/shiftModel";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";

//----------------------FOR SCHEDULER USE

//CREATE INDIVIDUAL SCHEDULED FROM WEEKLY SCHEDULED ID (PARAM)
export const populateToScheduled = catchAsync(async (req, res, next) => {
  //1. GRAB WHAT WE CAN FROM AVAILABLE
  const scheduler = req.scheduler.id;

  //2. GRAB RAW WEEKLY SCHEDULED FROM PARAM ID TO EXTRACT WEEKLY SHIFT THEN INDIVIDUAL SHIFTS
  const weeklyScheduled = await WeeklyScheduled.findById(req.params.id);
  const weeklyShift = await WeeklyShift.findById(weeklyScheduled!.weeklyShift);

  const shifts = [
    await Shift.findById(weeklyShift!.shiftDay1),
    await Shift.findById(weeklyShift!.shiftDay2),
    await Shift.findById(weeklyShift!.shiftDay3),
    await Shift.findById(weeklyShift!.shiftDay4),
    await Shift.findById(weeklyShift!.shiftDay5),
  ];

  //3. CREATE ARR WITH DATES TO LOOP INTO WHEN CREATING DOCS
  const dates: Date[] = [];

  //EXTRACT DAYS FROM SHIFT (MON, TUES, ETC...)
  shifts.forEach((el: any) => {
    //SET VARS TO CREATE DATE BASED ON SHIFT DAYS
    const currentDay = new Date(Date.now()).getDay();
    const shiftDay = el!.day;

    //TO DO: ENSURE ALL SHIFTS ARE STARTED ON THE NEXT MONDAY

    //MATCH SCHEDULED DATE DAY TO BE ASSIGNED TO SHIFT DAY
    //BY ADDING A WEEK (IN INDEX TERMS)
    //SUBTRACTING THE CURRENT DAY
    //AND DIVIDING BY A WEEK
    const setDay = (shiftDay + 6 - currentDay) % 7;

    //ADD A WEEK TO ENSURE SHIFTS ARE STARTED ON THE NEXT WEEK
    const setDate = new Date(Date.now()).setDate(setDay + 7);

    dates.push(new Date(setDate));
  });

  //4. CREATE ARR WITH SCHEDULED TO REPRESENT INDIVIDUAL DOCS
  const scheduled = [];

  for (let i = 0; i < shifts.length; i++) {
    //5. VALIDATE INDIVIDUAL SHIFTS BEFORE PUSH
    //   ENSURE SHIFT DAY AND SCHEDULED DATE DAY MATCHES
    if (shifts[i]!.day !== dates[i].getDay()) {
      return next(
        new AppError(
          `Shift day and scheduled date day do not match. Please enter a date that matches the shift day.`,
          400
        )
      );
    }

    scheduled.push({
      //SCHEDULEDS MUST HAVE { shift, employee, scheduler, date }
      shift: shifts[i]!.id,
      employee: weeklyScheduled!.employee,
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

export const getAllWeeklyScheduled = factory.getAll(WeeklyScheduled);
export const getWeeklyScheduled = factory.getOne(WeeklyScheduled);
export const createWeeklyScheduled = factory.createOne(WeeklyScheduled);
export const updateWeeklyScheduled = factory.updateOne(WeeklyScheduled);
export const deleteWeeklyScheduled = factory.deleteOne(WeeklyScheduled);
