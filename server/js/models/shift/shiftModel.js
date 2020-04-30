"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//SERVES ONLY AS A TEMPLATE
//DATA WILL BE COMPRISE MOSTLY OF SCHEDULED SHIFTS
const shiftSchema = new mongoose_1.default.Schema({
    position: {
        type: String,
        required: [true, `Shift position required.`],
    },
    slot: {
        type: String,
        required: [true, `Shift time slot required.`],
        enum: [`morning`, `day`, `swing`, `graveyard`],
    },
    location: {
        type: String,
        required: [true, `Shift location required.`],
        enum: [
            `rotunda`,
            `food court`,
            `castle coffee 1`,
            `castle coffee 2`,
            `pool`,
        ],
    },
    day: {
        type: Number,
        required: [true, `Shift day required.`],
        min: 0,
        max: 6,
    },
    hours: {
        type: [
            { type: Number, min: 0, max: 23 },
            { type: Number, min: 0, max: 23 },
        ],
        required: [true, `Shift hours required.`],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
//VIRTUAL POPULATE----------------------------------------------------------
//PREFERRED
shiftSchema.virtual(`preferred`, {
    ref: `Preferred`,
    foreignField: `shift`,
    localField: `_id`,
});
//SCHEDULED
shiftSchema.virtual(`scheduled`, {
    ref: `Scheduled`,
    foreignField: `shift`,
    localField: `_id`,
});
exports.Shift = mongoose_1.default.model(`Shift`, shiftSchema);
