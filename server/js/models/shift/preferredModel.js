"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//LIMITED 3 PER DAY OF THE WEEK FOR EACH EMPLOYEE
const preferredSchema = new mongoose_1.default.Schema({
    shift: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: `Shift`,
        required: [true, `Preferred shift must have a valid shift.`],
    },
    employee: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: `Employee`,
        required: [true, `Preferred shift must belong to an employee.`],
    },
    rank: {
        type: Number,
        required: [true, `Preferred shift rank required.`],
        enum: [1, 2, 3],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
//COMPOUND INDEX TO FIND IF PREFERRED SHIFT AND EMPLOYEE IS UNIQUE
preferredSchema.index({ shift: 1, employee: 1 }, { unique: true });
//SHOW IN FIND: SHIFT AND EMPLOYEE
preferredSchema.pre(/^find/, function (next) {
    this.populate(`shift`).populate(`employee`);
    next();
});
const Preferred = mongoose_1.default.model(`Preferred`, preferredSchema);
exports.default = Preferred;
