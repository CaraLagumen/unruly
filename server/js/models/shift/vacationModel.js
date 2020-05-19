"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const vacationSchema = new mongoose_1.default.Schema({
    employee: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: `Employee`,
        required: [true, `Vacation must belong to an employee.`],
    },
    scheduler: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: `Scheduler`,
    },
    date: {
        type: Date,
        required: [true, `Vacation date required.`],
    },
    approved: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
//COMPOUND INDEX TO FIND IF VACATION EMPLOYEE AND DATE IS UNIQUE
vacationSchema.index({ employee: 1, date: 1 }, { unique: true });
//SHOW IN FIND: EMPLOYEE
vacationSchema.pre(/^find/, function (next) {
    this.populate(`employee`).populate(`scheduler`);
    next();
});
const Vacation = mongoose_1.default.model(`Vacation`, vacationSchema);
exports.default = Vacation;
