import Shift from "../../models/shift/shiftModel";
import IShift from "../../types/shift/shiftInterface";
import WeeklyShift from "../../models/shift/weeklyShiftModel";
import IWeeklyShift from "../../types/shift/weeklyShiftInterface";
import Scheduled from "../../models/shift/scheduledModel";
import WeeklyScheduled from "../../models/shift/weeklyScheduledModel";
import Preferred from "../../models/shift/preferredModel";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";

//----------------------FOR SCHEDULER USE

export const getShiftsByHour = catchAsync(async (req, res, next) => {
  //FIND BY HOURS
  const doc = await Shift.find({
    $or: [
      { shiftStart: req.query.shiftStart },
      { shiftEnd: req.query.shiftEnd },
    ],
  });

  res.status(200).json({
    status: `success`,
    results: doc.length,
    doc,
  });
});

export const deleteShiftConnections = catchAsync(async (req, res, next) => {
  const shift = (await Shift.findById(req.params.id)) as IShift;
  const weeklyShift = (await WeeklyShift.findOne({
    $or: [
      { shiftDay1: shift },
      { shiftDay2: shift },
      { shiftDay3: shift },
      { shiftDay4: shift },
      { shiftDay5: shift },
    ],
  })) as IWeeklyShift;
  await WeeklyScheduled.findOneAndDelete({ weeklyShift });
  await Scheduled.deleteMany({ shift });
  await Preferred.deleteMany({ shift });

  if (weeklyShift) await WeeklyShift.findByIdAndDelete(weeklyShift.id);

  next();
});

export const getRawAllShifts = factory.getRawAll(Shift);
export const getAllShifts = factory.getAll(Shift);
export const getShift = factory.getOne(Shift);
export const createShift = factory.createOne(Shift);
export const updateShift = factory.updateOne(Shift);
export const deleteShift = factory.deleteOne(Shift);
