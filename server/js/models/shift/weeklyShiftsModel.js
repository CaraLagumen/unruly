"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//SERVES ONLY AS A TEMPLATE
//FOR WEEKLY SCHEDULED - AN ARRAY OF SHIFTS
const weeklyShiftsSchema = new mongoose_1.default.Schema({
    weeklyShift: {
        type: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: `Shift`,
                required: [true, `Weekly shifts must use valid shifts.`],
            },
        ],
        minlength: 5,
        maxlength: 5,
        required: [true, `Weekly shifts must be valid.`]
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
//VIRTUAL POPULATE----------------------------------------------------------
//WEEKLY SCHEDULED
weeklyShiftsSchema.virtual(`weeklyScheduled`, {
    ref: `WeeklyScheduled`,
    foreignField: `weeklyShifts`,
    localField: `_id`,
});
const WeeklyShifts = mongoose_1.default.model(`WeeklyShifts`, weeklyShiftsSchema);
exports.default = WeeklyShifts;
