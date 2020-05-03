import Scheduled from "../../models/shift/scheduledModel";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import APIFeatures from "../../utils/apiFeatures";

//----------------------FOR SCHEDULER USE

//MAIN----------------------------------------------------------

//CREATE SCHEDULED SHIFT WITH EMPLOYEE FROM SHIFT ID AND EMPLOYEE ID (ENTERED)
export const createScheduled = catchAsync(async (req, res, next) => {
  const shift = req.body.shiftId;
  const employee = req.body.employeeId;
  const scheduler = req.scheduler.id;
  const date = req.body.date;

  const doc = await Scheduled.create({ shift, employee, scheduler, date });

  res.status(201).json({
    status: `success`,
    doc,
  });
});

//GET ALL SCHEDULED SHIFTS OF EMPLOYEE FROM EMPLOYEE ID (ENTERED)
export const getEmployeeSchedule = catchAsync(async (req, res, next) => {
  //1. ADD SEARCH FUNCTIONALITY
  const features = new APIFeatures(
    Scheduled.find({ employee: req.body.employeeId }),
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

//STANDARD----------------------------------------------------------

export const getAllScheduled = factory.getAll(Scheduled);
export const getScheduled = factory.getOne(Scheduled);
export const deleteScheduled = factory.deleteOne(Scheduled);