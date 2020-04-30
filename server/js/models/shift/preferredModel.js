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
//LIMITED 3 PER DAY OF THE WEEK FOR EACH EMPLOYEE
const preferredSchema = new mongoose.Schema({
    shift: {
        type: mongoose.Schema.ObjectId,
        ref: `Shift`,
        required: [true, `Preferred shift must have a valid shift.`],
    },
    employee: {
        type: mongoose.Schema.ObjectId,
        ref: `Employee`,
        required: [true, `Preferred shift must belong to an employee.`],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    rank: {
        type: Number,
        required: [true, `Preferred shift rank required.`],
        enum: [1, 2, 3],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
//COMPOUND INDEX TO FIND IF PREFERRED SHIFT AND EMPLOYEE IS UNIQUE
preferredSchema.index({ shift: 1, employee: 1 }, { unique: true });
//SHOW IN FIND SHIFT & FIND EMPLOYEE
preferredSchema.pre(/^find/, (next) => {
    this.populate(`shift`).populate(`employee`);
    next();
});
exports.Preferred = mongoose.model(`Preferred`, preferredSchema);
