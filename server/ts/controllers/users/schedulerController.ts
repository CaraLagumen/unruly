import Scheduler from "../../models/users/schedulerModel";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";

export const getAllSchedulers = factory.getAll(Scheduler);
export const getScheduler = factory.getOne(Scheduler);
export const createScheduler = factory.createOne(Scheduler);
export const updateScheduler = factory.updateOne(Scheduler);
export const deleteScheduler = factory.deleteOne(Scheduler);
