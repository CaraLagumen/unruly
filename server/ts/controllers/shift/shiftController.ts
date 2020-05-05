import Shift from "../../models/shift/shiftModel";
import * as factory from "../handlerFactory";

//----------------------FOR SCHEDULER USE

export const getAllShifts = factory.getAll(Shift);
export const getShift = factory.getOne(Shift);
export const createShift = factory.createOne(Shift);
export const updateShift = factory.updateOne(Shift);
export const deleteShift = factory.deleteOne(Shift);
