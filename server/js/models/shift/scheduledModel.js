"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const mongoose = __importStar(require("mongoose"));
//MOST CREATED DATA
const scheduledSchema = new mongoose.Schema({
    shift: {
        type: mongoose.Schema.ObjectId,
        ref: `Shift`,
        required: [true, `Scheduled shift required.`],
    },
    employee: {
        type: mongoose.Schema.ObjectId,
        ref: `Employee`,
        required: [true, `Scheduled shift employee required.`],
    },
    scheduler: {
        type: mongoose.Schema.ObjectId,
        ref: `Scheduler`,
        required: [true, `Scheduled shift scheduler required.`],
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
scheduledSchema.pre(/^find/, (next) => {
    this.populate(`employee`).populate(`scheduler`);
    next();
});
const Scheduled = mongoose.model(`Scheduled`, scheduledSchema);
exports.default = Scheduled;
