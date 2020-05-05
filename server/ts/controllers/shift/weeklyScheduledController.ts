import IWeeklyScheduled from "../../models/shift/weeklyScheduledModel";
import * as factory from "../handlerFactory";

//----------------------FOR SCHEDULER USE

export const getAllWeeklyScheduleds = factory.getAll(IWeeklyScheduled);
export const getWeeklyScheduled = factory.getOne(IWeeklyScheduled);
export const createWeeklyScheduled = factory.createOne(IWeeklyScheduled);
export const updateWeeklyScheduled = factory.updateOne(IWeeklyScheduled);
export const deleteWeeklyScheduled = factory.deleteOne(IWeeklyScheduled);
