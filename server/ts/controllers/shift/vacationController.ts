import Vacation from "../../models/shift/vacationModel";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import APIFeatures from "../../utils/apiFeatures";
import AppError from "../../utils/appError";

//----------------------FOR EMPLOYEE USE
//MAIN----------------------------------------------------------

//REQUEST VACATION FOR LOGGED IN EMPLOYEE FROM DATE (ENTERED)
export const requestVacation = catchAsync(async (req, res, next) => {
  const employee = req.employee.id;
  const date = req.body.date; //DATE MUST BE IN YYYY-MM-DD

  const doc = await Vacation.create({ employee, date });

  res.status(201).json({
    status: `success`,
    doc,
  });
});

//DELETE VACATION OF LOGGED IN EMPLOYEE FROM VACATION ID (PARAM)
export const deleteMyVacation = catchAsync(async (req, res, next) => {
  const doc = await Vacation.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError(`No document found with that ID.`, 404));
  }

  res.status(204).json({
    status: `success`,
    doc: null,
  });
});

//GET ALL VACATIONS OF LOGGED IN EMPLOYEE
export const getAllMyVacations = catchAsync(async (req, res, next) => {
  //1. ADD SEARCH FUNCTIONALITY
  const features = new APIFeatures(
    Vacation.find({ employee: req.employee.id }),
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

//----------------------FOR SCHEDULER USE
//STANDARD----------------------------------------------------------

export const getAllVacations = factory.getAll(Vacation);
export const getVacation = factory.getOne(Vacation);
export const createVacation = factory.createOne(Vacation);
export const updateVacation = factory.updateOne(Vacation);
export const deleteVacation = factory.deleteOne(Vacation);
