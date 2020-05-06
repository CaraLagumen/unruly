"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vacationModel_1 = __importDefault(require("../../models/shift/vacationModel"));
const factory = __importStar(require("../handlerFactory"));
//----------------------FOR SCHEDULER USE
exports.getAllVacations = factory.getAll(vacationModel_1.default);
exports.getVacation = factory.getOne(vacationModel_1.default);
exports.createVacation = factory.createOne(vacationModel_1.default);
exports.updateVacation = factory.updateOne(vacationModel_1.default);
exports.deleteVacation = factory.deleteOne(vacationModel_1.default);
