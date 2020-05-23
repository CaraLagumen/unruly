import Preferred from "../../models/shift/preferredModel";
import Shift from "../../models/shift/shiftModel";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import APIFeatures from "../../utils/apiFeatures";
import AppError from "../../utils/appError";

//----------------------FOR EMPLOYEE USE

//TOOLS----------------------------------------------------------

//GRAB SHIFT ID FROM PREFERRED FOR VALIDATION ON UPDATE
export const getBody = catchAsync(async (req, res, next) => {
  const preferred = await Preferred.findById(req.params.id);
  req.body.shift = preferred!.shift.id;

  next();
});

//EACH EMPLOYEE SHOULD ONLY HAVE 3 PREFERRED PER DAY
//ENSURE PREFERRED IS NOT THE 4TH PREFERRRED SHIFT OF THE DAY
export const validatePreferred = catchAsync(async (req, res, next) => {
  //1. FIND EQUIVALENT SHIFT FROM SHIFT ID (ENTERED) AND RANK (ENTERED)
  const shift = await Shift.findById(req.body.shift);
  const rank = req.body.rank;

  //2. FIND ALL PREFERRED BELONGING TO EMPLOYEE AND FILTER BY
  //   MATCHING THE PREFERRED SHIFT DAYS TO THE ENTERED SHIFT DAY
  const allMyPreferred = await Preferred.find({ employee: req.employee.id });
  const allMyPreferredOfTheDay = allMyPreferred.filter(
    (preferred) => preferred.shift.day === shift!.day
  );

  //3. FILTER RANK BY MATCHING PREFERRED RANK TO THE ENTERED RANK
  const preferredRankMatch = allMyPreferredOfTheDay.filter(
    (preferred) => preferred.rank === rank
  );

  //4. ERROR IF FOUND A MATCHED RANK
  if (preferredRankMatch.length > 0) {
    return next(
      new AppError(`Rank is a duplicate. Please enter a different rank.`, 400)
    );
  }

  //5. ERROR IF PREFERRED FOR THE DAY EXCEEDED
  if (allMyPreferredOfTheDay.length > 2) {
    return next(
      new AppError(
        `Number of preferred for this day exceeded. Only 3 allowed per day.`,
        400
      )
    );
  }

  //4. ALLOW WHEN ALL VALIDATED
  next();
});

//MAIN----------------------------------------------------------

//SAVE PREFERRED OF LOGGED IN EMPLOYEE FROM SHIFT ID (ENTERED)
export const saveMyPreferred = catchAsync(async (req, res, next) => {
  const shift = req.body.shift;
  const employee = req.employee.id;
  const rank = req.body.rank;

  const doc = await Preferred.create({ shift, employee, rank });

  res.status(201).json({
    status: `success`,
    doc,
  });
});

//UPDATE PREFERRED OF LOGGED IN EMPLOYEE FROM PREFERRED ID (ENTERED)
export const updateMyPreferred = catchAsync(async (req, res, next) => {
  const doc = await Preferred.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError(`No document found with that ID.`, 404));
  }

  res.status(201).json({
    status: `success`,
    doc,
  });
});

//DELETE PREFERRED OF LOGGED IN EMPLOYEE FROM PREFERRED ID (PARAM)
export const deleteMyPreferred = catchAsync(async (req, res, next) => {
  const doc = await Preferred.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError(`No document found with that ID.`, 404));
  }

  res.status(204).json({
    status: `success`,
    doc: null,
  });
});

//GET ALL PREFERRED OF LOGGED IN EMPLOYEE
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
