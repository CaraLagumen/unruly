"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
moment_timezone_1.default.tz.setDefault(`UTC`);
//IMPORTANT - BE SURE TO USE .clone() WHEN ALTERING
//WEEK TO SCHEDULE (EX. 21)
exports.schedulingWeek = moment_1.default().add(2, "w").startOf("w");
//THIS COMING WEEK (SHOULD ALREADY BE SCHEDULED EX. 14)
exports.comingWeek = moment_1.default().add(1, "w").startOf("w");
//SCHEDULING START DAY (EX. 15 A MONDAY)
exports.startSchedule = moment_1.default().add(2, "w").isoWeekday(1);
