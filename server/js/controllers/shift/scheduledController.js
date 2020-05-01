"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const scheduledModel_1 = require("../../models/shift/scheduledModel");
const factory = __importStar(require("../handlerFactory"));
exports.getAllScheduled = factory.getAll(scheduledModel_1.Scheduled);
exports.getScheduled = factory.getOne(scheduledModel_1.Scheduled);
exports.deleteScheduled = factory.deleteOne(scheduledModel_1.Scheduled);
