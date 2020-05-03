import Preferred from "../../models/shift/preferredModel";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import APIFeatures from "../../utils/apiFeatures";
import AppError from "../../utils/appError";

//----------------------FOR EMPLOYEE USE

//MAIN----------------------------------------------------------

//SAVE PREFERRED SHIFT OF LOGGED IN EMPLOYEE FROM SHIFT ID (PARAM)
export const saveMyPreferred = catchAsync(async (req, res, next) => {
  const shift = req.params.id;
  const employee = req.employee.id;
  const rank = req.body.rank;

  const doc = await Preferred.create({ shift, employee, rank });

  res.status(201).json({
    status: `success`,
    doc,
  });
});

//DELETE MY PREFERRED SHIFT OF LOGGED IN EMPLOYEE FROM SHIFT ID (ENTERED)
export const deleteMyPreferred = catchAsync(async (req, res, next) => {
  const shift = req.body.shiftId;
  const employee = req.employee.id;

  const doc = await Preferred.deleteOne({ shift, employee });

  if (!doc) {
    return next(new AppError(`No document found with that ID.`, 404));
  }

  res.status(204).json({
    status: `success`,
    doc: null,
  });
});

//GET ALL PREFERRED SHIFTS OF LOGGED IN EMPLOYEE
export const getAllMyPreferred = catchAsync(async (req, res, next) => {
  //1. ADD SEARCH FUNCTIONALITY
  const features = new APIFeatures(
    Preferred.find({ employee: req.employee.id }),
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

export const getAllPreferred = factory.getAll(Preferred);
export const getPreferred = factory.getOne(Preferred);
export const deletePreferred = factory.deleteOne(Preferred);
