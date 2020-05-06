import WeeklyShift from "../../models/shift/weeklyShiftModel";
import Shift from "../../models/shift/shiftModel";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";

//----------------------FOR SCHEDULER USE

//TOOLS----------------------------------------------------------

export const validateWeeklyShift = catchAsync(async (req, res, next) => {
  //----A. ENSURE ALL SHIFTS HAVE DIFFERENT DAYS (MON, TUES, ETC...)

  //1. GRAB RAW SHIFTS FROM ENTERED SHIFT IDS FOR ELABORATE COMPARISON
  const shifts = [
    await Shift.findById(req.body.shiftDay1),
    await Shift.findById(req.body.shiftDay2),
    await Shift.findById(req.body.shiftDay3),
    await Shift.findById(req.body.shiftDay4),
    await Shift.findById(req.body.shiftDay5),
  ];
  //SORT BY DAY FOR USE WITH B.
  shifts.sort((el1: any, el2: any) => el1.day - el2.day);

  //2. CREATE ARR WITH DAYS (MON, TUES, ETC...) TO FIND DUPLICATES
  const days = shifts.map((el: any) => el.day);
  const duplicates = days.filter((el: any, i) => days.indexOf(el) !== i);

  //3. THROW ERROR IF DUPLICATE DAYS FOUND
  if (duplicates.length !== 0) {
    return next(
      new AppError(
        `Duplicate shift days found. Please enter unique shift days.`,
        400
      )
    );
  }

  //----B. ENSURE ALL SHIFTS HAVE AT LEAST 8 HOURS APART
  
  //TO DO: VALIDATE THAT IF shiftDay5 IS SATURDAY AND shiftDay1 IS SUNDAY,
  //       THEY ARE ALSO 8 HOURS IN BETWEEN

  //1. CREATE ARRS WITH HOURS TO COMPARE (ARR: [[4, 0], [4, 0], ETC...])
  const startHours = shifts.map((el: any) => el.shiftStart);
  const endHours = shifts.map((el: any) => el.shiftEnd);

  //2. CHECK ONLY THE CONSECUTIVE DAYS, DELETE IF NOT
  for (let i = 0; i < days.length; i++) {
    if (i === 4) {
      //DON'T COMPARE IF IT'S THE LAST DAY
      continue;
    } else if (days[i + 1] - days[i] !== 1) {
      //CHECK DAY AFTER MINUS DAY BEFORE TO SEE IF IT'S 1 DAY APART
      //IF IT'S NOT 1 DAY APART, REMOVE FROM COMPARISON
      startHours.splice(i + 1, 1);
      endHours.splice(i + 1, 1);
    }
  }

  //3. CHECK ONLY TIME IN BETWEEN END SHIFT OF DAY BEFORE
  //   AND START SHIFT OF DAY AFTER BY OFFSETTING ARRS
  startHours.splice(0, 1);
  endHours.splice(endHours.length - 1, 1);

  //4. CONVERT ARRS TO FAKE DATES FOR EASIER TIME COMPARISON
  const startHoursInGetTimeForm = startHours.map((el: any, i: number) => {
    return new Date(1991, 8, i + 2, el[0]).getTime();
  });
  const endHoursInGetTimeForm = endHours.map((el: any, i: number) => {
    return new Date(1991, 8, i + 1, el[0]).getTime();
  });
  const hoursInBetween = 28800000; //8 HOURS IN MILLISECONDS

  //5. LOOP THROUGH ARRS TO FIND DIFFERENCE IN HOURS
  for (let i = 0; i < startHoursInGetTimeForm.length; i++) {
    const difference = startHoursInGetTimeForm[i] - endHoursInGetTimeForm[i];

    //6. THROW ERROR IF DIFFERENCE LESS THAN 8
    if (difference < hoursInBetween) {
      return next(
        new AppError(
          `Overtime found. Please enter shifts with no overtime.`,
          400
        )
      );
    }
  }

  //C. ALLOW NEXT IF NO DUPLICATES
  next();
});

//FOR UPDATES AND USING validateWeeklyShiftDays
//CREATE REF SINCE req.body WILL HAVE INCOMPLETE INFO FOR VALIDATION
export const setupUpdatedWeeklyShift = catchAsync(async (req, res, next) => {
  //1. GRAB RAW WEEKLY SHIFT FROM PARAM ID FOR ELABORATE COMPARISON
  const weeklyShift = await WeeklyShift.findById(req.params.id);

  //2. CREATE OBJ TO BE COMPATIBLE WITH ENTERED JSON
  //   ALL IDS GRABBED TO ACCOUNT FOR ANY SHIFT CHOSEN TO REPLACE
  let shiftsRef = {
    shiftDay1: weeklyShift?.shiftDay1.id,
    shiftDay2: weeklyShift?.shiftDay2.id,
    shiftDay3: weeklyShift?.shiftDay3.id,
    shiftDay4: weeklyShift?.shiftDay4.id,
    shiftDay5: weeklyShift?.shiftDay5.id,
  };

  //3. GRAB ENTERED SHIFTS FOR REPLACEMENT
  const shiftsToBeReplaced = req.body;

  //4. REPLACE
  Object.assign(shiftsRef, shiftsToBeReplaced);

  //5. SEND NEW req.body
  req.body = shiftsRef;
  next();
});

//STANDARD----------------------------------------------------------

export const getAllWeeklyShifts = factory.getAll(WeeklyShift);
export const getWeeklyShift = factory.getOne(WeeklyShift);
export const createWeeklyShift = factory.createOne(WeeklyShift);
export const updateWeeklyShift = factory.updateOne(WeeklyShift);
export const deleteWeeklyShift = factory.deleteOne(WeeklyShift);
