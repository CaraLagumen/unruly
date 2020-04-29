"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
//SERVES ONLY AS A TEMPLATE
//DATA WILL BE COMPRISE MOSTLY OF SCHEDULED SHIFTS
const shiftSchema = new mongoose.Schema({
    position: {
        type: String,
        required: [true, `Position required.`],
    },
    slot: {
        type: String,
        required: [true, `Time slot required.`],
        enum: [`morning`, `day`, `swing`, `graveyard`],
    },
    location: {
        type: String,
        required: [true, `Location required.`],
        enum: [
            `rotunda`,
            `food court`,
            `castle coffee 1`,
            `castle coffee 2`,
            `pool`,
        ],
    },
    day: {
        type: String,
        required: [true, `Day required.`],
        enum: [
            `monday`,
            `tuesday`,
            `wednesday`,
            `thursday`,
            `friday`,
            `saturday`,
            `sunday`,
        ],
    },
    time: {
        type: Number,
        required: [true, `Time required.`],
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
const Shift = mongoose.model(`Shift`, shiftSchema);
exports.default = Shift;
