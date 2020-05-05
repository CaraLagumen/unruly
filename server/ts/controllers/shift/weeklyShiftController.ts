import WeeklyShift from "../../models/shift/weeklyShiftModel";
import Shift from "../../models/shift/shiftModel";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";

//----------------------FOR SCHEDULER USE

export const validateWeeklyShiftDays = catchAsync(async (req, res, next) => {
  //1. GRAB RAW SHIFTS FROM ENTERED SHIFT IDS FOR ELABORATE COMPARISON
  const shifts = [
    await Shift.findById(req.body.shiftDay1),
    await Shift.findById(req.body.shiftDay2),
    await Shift.findById(req.body.shiftDay3),
    await Shift.findById(req.body.shiftDay4),
    await Shift.findById(req.body.shiftDay5),
  ];

  //2. CREATE ARR WITH DAYS (MON, TUES, ETC...) TO FIND DUPLICATES
  const days = shifts.map((el: any) => el.day);
  const duplicates = days.filter((el: any, i) => days.indexOf(el) !== i);

  //3. THROW ERROR IF DUPLICATES FOUND
  if (duplicates.length !== 0) {
    return next(
      new AppError(
        `Duplicate shift days found. Please enter unique shift days.`,
        400
      )
    );
  }

  //4. ALLOW CREATION IF NO DUPLICATES
  next();
});

export const insertUpdatedWeeklyShift = catchAsync(async (req, res, next) => {
  //1. GRAB RAW WEEKLY SHIFT FROM PARAM ID FOR ELABORATE COMPARISON
  const weeklyShift = await WeeklyShift.findById(req.params.id);

  //2. CREATE OBJ TO BE COMPATIBLE WITH ENTERED JSON
  //   ALL IDS GRABBED TO ACCOUNT FOR ANY SHIFT CHOSEN TO REPLACE
  let shifts = {
    shiftDay1: weeklyShift?.shiftDay1.id,
    shiftDay2: weeklyShift?.shiftDay2.id,
    shiftDay3: weeklyShift?.shiftDay3.id,
    shiftDay4: weeklyShift?.shiftDay4.id,
    shiftDay5: weeklyShift?.shiftDay5.id,
  };

  //3. GRAB ENTERED SHIFTS FOR REPLACEMENT
  const shiftsToBeReplaced = req.body;

  //4. REPLACE
  Object.assign(shifts, shiftsToBeReplaced);

  //5. SEND NEW req.body
  req.body = shifts;
  next();
});

export const getAllWeeklyShifts = factory.getAll(WeeklyShift);
export const getWeeklyShift = factory.getOne(WeeklyShift);
export const createWeeklyShift = factory.createOne(WeeklyShift);
export const updateWeeklyShift = factory.updateOne(WeeklyShift);
export const deleteWeeklyShift = factory.deleteOne(WeeklyShift);
