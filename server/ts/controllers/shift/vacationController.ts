import moment from "moment";

import Employee from "../../models/users/employeeModel";
import Vacation from "../../models/shift/vacationModel";
import IVacation from "../../types/shift/vacationInterface";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import APIFeatures from "../../utils/apiFeatures";
import AppError from "../../utils/appError";

//----------------------FOR EMPLOYEE USE

//ENSURE REQUESTED VACATION DATE IS AHEAD OF NOW
export const validateVacationDate = catchAsync(async (req, res, next) => {
  const date = moment(req.body.date);
  const comingWeek = moment().add(1, "w").endOf("w");

  if (date < comingWeek) {
    return next(
      new AppError(
        `Requested vacation date is this coming week or in the past. Please enter a date in the future.`,
        400
      )
    );
  }

  next();
});

//TOOLS----------------------------------------------------------

//ENSURE EMPLOYEE VACATION DOES NOT EXCEED THEIR ALLOTTED VACATION
//PER YEAR BASED ON HIRE DATE [YEARS WORKED - VACATION DAYS]
export const validateRequestedVacation = catchAsync(async (req, res, next) => {
  const employee = await Employee.findById(req.employee.id);
  const myHireDate = moment(employee!.hireDate);
  const myYearsWorked = moment().diff(myHireDate, "y");

  //1. FIND START OF YEAR TO COUNT VACATIONS FROM BASED ON HIRE DATE
  const yearNow = moment().year();
  const startOfMyYear = myHireDate.clone().year(yearNow);

  //2. SET START OF YEAR COUNT THIS YEAR IF HIRE MONTH AND DAY IS IN THE PAST
  //   OTHERWISE SUBTRACT A YEAR IF HIRE MONTH AND DAY IS IN THE FUTURE
  startOfMyYear < moment() ? startOfMyYear : startOfMyYear.subtract(1, "y");

  //3. GRAB ALL EMPLOYEE VACATIONS THEN FILTER OUT THE ONES THAT ARE
  //   FOR THIS YEAR BASED ON THE startOfMyYear
  const allMyVacations = await Vacation.find({ employee: req.employee.id });
  const allMyVacationsThisYear = allMyVacations.filter((vacation) => {
    return moment(vacation.date) > startOfMyYear;
  });

  //4. EMPLOYEE VACATION NUMBER DECIDED BY HIRE DATE
  //   [YEARS WORKED - VACATION DAYS]
  const myNumberOfVacationDays = () => {
    if (myYearsWorked >= 5) {
      return 19; //5 YEARS - 20 DAYS
    } else if (myYearsWorked >= 2) {
      return 9; //2 YEARS - 10 DAYS
    } else if (myYearsWorked >= 1) {
      return 4; //1 YEAR - 5 DAYS
    } else {
      return -1;
    }
  };

  //5. ERROR IF NUMBER OF VACATION DAYS EXCEEDED
  if (
    allMyVacationsThisYear.length > myNumberOfVacationDays() ||
    myNumberOfVacationDays() === -1
  ) {
    return next(
      new AppError(
        `Number of vacation days ${
          myNumberOfVacationDays() + 1
        } exceeded. Unable to request vacation.`,
        400
      )
    );
  }

  //6. ALLOW NEXT WHEN ALL VALIDATED
  next();
});

//MAIN----------------------------------------------------------

//REQUEST VACATION FOR LOGGED IN EMPLOYEE FROM DATE (ENTERED)
export const requestVacation = catchAsync(async (req, res, next) => {
  const employee: string = req.employee.id;
  const date: Date = req.body.date; //DATE MUST BE IN YYYY-MM-DD

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
  const doc: IVacation[] = await features.query;

  //3. SEND DATA
  res.status(200).json({
    status: `success`,
    results: doc.length,
    doc,
  });
});

//----------------------FOR SCHEDULER USE

//STANDARD----------------------------------------------------------

export const getRawAllVacations = factory.getRawAll(Vacation);
export const getAllVacations = factory.getAll(Vacation);
export const getVacation = factory.getOne(Vacation);
export const createVacation = factory.createOne(Vacation);
export const updateVacation = factory.updateOne(Vacation);
export const deleteVacation = factory.deleteOne(Vacation);
