import { RequestHandler } from "express";

import Scheduler from "../../models/users/schedulerModel";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";

//TOOLS----------------------------------------------------------

//FILTERED FIELDS FOR updateMe
const filterObj = (obj: { [key: string]: string }, ...allowedFields: string[]) => {
  const newObj: { [key: string]: string } = {};

  Object.keys(obj).forEach((el: string) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

//MAIN----------------------------------------------------------

//GET LOGGED IN SCHEDULER
export const getMe: RequestHandler = (req, res, next) => {
  req.params.id = req.scheduler.id;
  next();
};

//UPDATE LOGGED IN SCHEDULER
export const updateMe: RequestHandler = catchAsync(async (req, res, next) => {
  //1. CREATE ERROR IF SCHEDULER POSTS PASSWORD DATA
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        `This route is not for password updates. Use /updateMyPassword.`,
        400
      )
    );
  }

  //2. FILTER FIELD NAMES THAT ARE ALLOWED TO BE UPDATED
  const filteredBody = filterObj(req.body, `email`);

  //3. UPDATE SCHEDULER DOC
  const updatedScheduler = await Scheduler.findByIdAndUpdate(
    req.scheduler.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  //4. SEND UPDATED SCHEDULER
  res.status(200).json({
    status: `success`,
    user: updatedScheduler,
  });
});

//STANDARD----------------------------------------------------------

export const getAllSchedulers = factory.getAll(Scheduler);
export const getScheduler = factory.getOne(Scheduler);
export const createScheduler = factory.createOne(Scheduler);
export const updateScheduler = factory.updateOne(Scheduler);
export const deleteScheduler = factory.deleteOne(Scheduler);
