import IWeeklyShift from "../../models/shift/weeklyShiftModel";
import * as factory from "../handlerFactory";

//----------------------FOR SCHEDULER USE

export const getAllWeeklyShifts = factory.getAll(IWeeklyShift);
export const getWeeklyShift = factory.getOne(IWeeklyShift);
export const createWeeklyShift = factory.createOne(IWeeklyShift);
export const updateWeeklyShift = factory.updateOne(IWeeklyShift);
export const deleteWeeklyShift = factory.deleteOne(IWeeklyShift);