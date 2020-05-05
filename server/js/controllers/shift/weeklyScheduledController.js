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
const weeklyScheduledModel_1 = __importDefault(require("../../models/shift/weeklyScheduledModel"));
const factory = __importStar(require("../handlerFactory"));
//----------------------FOR SCHEDULER USE
exports.getAllWeeklyScheduleds = factory.getAll(weeklyScheduledModel_1.default);
exports.getWeeklyScheduled = factory.getOne(weeklyScheduledModel_1.default);
exports.createWeeklyScheduled = factory.createOne(weeklyScheduledModel_1.default);
exports.updateWeeklyScheduled = factory.updateOne(weeklyScheduledModel_1.default);
exports.deleteWeeklyScheduled = factory.deleteOne(weeklyScheduledModel_1.default);
