"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//SERVES ONLY AS A TEMPLATE
//FOR WEEKLY SCHEDULED - AN ARRAY OF SHIFTS
const weeklyShiftSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, `Weekly shift name required.`],
        unique: true,
    },
    position: {
        type: String,
        required: [true, `Weekly shift position required.`],
        enum: [`general manager`, `assistant manager`, `lead`, `barista`],
    },
    slot: {
        type: [String],
        required: [true, `Weekly shift time slot/s required.`],
        enum: [`morning`, `day`, `swing`, `graveyard`],
    },
    location: {
        type: [String],
        required: [true, `Weekly shift location/s required.`],
        enum: [`rotunda`, `food court`, `tower 1`, `tower 2`, `pool`, `breaker`],
    },
    shiftDay1: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: `Shift`,
        required: [true, `Weekly shifts must use unique and valid shifts.`],
    },
    shiftDay2: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: `Shift`,
        required: [true, `Weekly shifts must use unique and valid shifts.`],
    },
    shiftDay3: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: `Shift`,
        required: [true, `Weekly shifts must use unique and valid shifts.`],
    },
    shiftDay4: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: `Shift`,
        required: [true, `Weekly shifts must use unique and valid shifts.`],
    },
    shiftDay5: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: `Shift`,
        required: [true, `Weekly shifts must use unique and valid shifts.`],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
//SHOW IN FIND: SHIFT
weeklyShiftSchema.pre(/^find/, function (next) {
    this.populate(`shiftDay1`)
        .populate(`shiftDay2`)
        .populate(`shiftDay3`)
        .populate(`shiftDay4`)
        .populate(`shiftDay5`);
    next();
});
//VIRTUAL POPULATE----------------------------------------------------------
//WEEKLY SCHEDULED
weeklyShiftSchema.virtual(`weeklyScheduled`, {
    ref: `WeeklyScheduled`,
    foreignField: `weeklyShift`,
    localField: `_id`,
});
const WeeklyShift = mongoose_1.default.model(`weeklyShift`, weeklyShiftSchema);
exports.default = WeeklyShift;
