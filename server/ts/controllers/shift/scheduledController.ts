import { Scheduled } from "../../models/shift/scheduledModel";
import * as factory from "../handlerFactory";

export const getAllScheduled = factory.getAll(Scheduled);
export const getScheduled = factory.getOne(Scheduled);
export const deleteScheduled = factory.deleteOne(Scheduled);