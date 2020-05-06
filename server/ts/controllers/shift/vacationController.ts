import Vacation from "../../models/shift/vacationModel";
import * as factory from "../handlerFactory";

//----------------------FOR SCHEDULER USE

export const getAllVacations = factory.getAll(Vacation);
export const getVacation = factory.getOne(Vacation);
export const createVacation = factory.createOne(Vacation);
export const updateVacation = factory.updateOne(Vacation);
export const deleteVacation = factory.deleteOne(Vacation);
