"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//FOR FULL-TIMERS - MUST CREATE INDIVIDUAL SCHEDULED SHIFTS FROM THIS MODEL
const weeklyScheduledSchema = new mongoose_1.default.Schema({
    employee: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: `Employee`,
        required: [true, `Weekly scheduled shifts must belong to an employee.`],
        unique: true,
    },
    scheduler: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: `Scheduler`,
        required: [true, `Weekly scheduled shifts must have a scheduler.`],
    },
    weeklyShift: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: `WeeklyShift`,
        required: [true, `Weekly scheduled shifts must have valid weekly shift.`],
    },
    startDate: {
        type: Date,
        required: [true, `Weekly scheduled shifts must have a start date.`],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
//SHOW IN FIND: EMPLOYEE, SCHEDULER, AND WEEKLYSHIFT
weeklyScheduledSchema.pre(/^find/, function (next) {
    this.populate(`employee`).populate(`scheduler`).populate(`weeklyShift`);
    next();
});
const WeeklyScheduled = mongoose_1.default.model(`WeeklyScheduled`, weeklyScheduledSchema);
exports.default = WeeklyScheduled;
