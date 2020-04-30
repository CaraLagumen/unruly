"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//MOST CREATED DATA
const scheduledSchema = new mongoose_1.default.Schema({
    shift: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: `Shift`,
        required: [true, `Scheduled shift must be a valid shift.`],
    },
    employee: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: `Employee`,
        required: [true, `Scheduled shift must belong to an employee.`],
    },
    scheduler: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: `Scheduler`,
        required: [true, `Scheduled shift must have a scheduler.`],
    },
    date: {
        type: Date,
        required: [true, `Scheduled shift date required.`],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
//COMPOUND INDEX TO FIND IF SCHEDULED SHIFT AND EMPLOYEE IS UNIQUE
scheduledSchema.index({ shift: 1, employee: 1, scheduler: 1 }, { unique: true });
//SHOW IN FIND EMPLOYEE & FIND SCHEDULER
scheduledSchema.pre(/^find/, function (next) {
    this.populate(`employee`).populate(`scheduler`);
    next();
});
exports.Scheduled = mongoose_1.default.model(`Scheduled`, scheduledSchema);
