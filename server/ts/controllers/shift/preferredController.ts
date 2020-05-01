import { Preferred } from "../../models/shift/preferredModel";
import * as factory from "../handlerFactory";

export const getAllPreferred = factory.getAll(Preferred);
export const getPreferred = factory.getOne(Preferred);
export const deletePreferred = factory.deleteOne(Preferred);
