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
const weeklyShiftModel_1 = __importDefault(require("../../models/shift/weeklyShiftModel"));
const factory = __importStar(require("../handlerFactory"));
//----------------------FOR SCHEDULER USE
exports.getAllWeeklyShifts = factory.getAll(weeklyShiftModel_1.default);
exports.getWeeklyShift = factory.getOne(weeklyShiftModel_1.default);
exports.createWeeklyShift = factory.createOne(weeklyShiftModel_1.default);
exports.updateWeeklyShift = factory.updateOne(weeklyShiftModel_1.default);
exports.deleteWeeklyShift = factory.deleteOne(weeklyShiftModel_1.default);
