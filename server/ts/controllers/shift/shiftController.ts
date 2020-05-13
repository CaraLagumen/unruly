import Shift from "../../models/shift/shiftModel";
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

export const getRawAllShifts = factory.getRawAll(Shift);
export const getAllShifts = factory.getAll(Shift);
export const getShift = factory.getOne(Shift);
export const createShift = factory.createOne(Shift);
export const updateShift = factory.updateOne(Shift);
export const deleteShift = factory.deleteOne(Shift);
