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
const schedulerModel_1 = __importDefault(require("../../models/users/schedulerModel"));
const factory = __importStar(require("../handlerFactory"));
exports.getAllSchedulers = factory.getAll(schedulerModel_1.default);
exports.getScheduler = factory.getOne(schedulerModel_1.default);
exports.createScheduler = factory.createOne(schedulerModel_1.default);
exports.updateScheduler = factory.updateOne(schedulerModel_1.default);
exports.deleteScheduler = factory.deleteOne(schedulerModel_1.default);
