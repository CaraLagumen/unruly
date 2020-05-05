import WeeklyScheduled from "../../models/shift/weeklyScheduledModel";
import * as factory from "../handlerFactory";

//----------------------FOR SCHEDULER USE

export const getAllWeeklyScheduleds = factory.getAll(WeeklyScheduled);
export const getWeeklyScheduled = factory.getOne(WeeklyScheduled);
export const createWeeklyScheduled = factory.createOne(WeeklyScheduled);
export const updateWeeklyScheduled = factory.updateOne(WeeklyScheduled);
export const deleteWeeklyScheduled = factory.deleteOne(WeeklyScheduled);
