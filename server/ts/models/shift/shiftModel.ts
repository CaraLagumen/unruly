import mongoose, { Schema } from "mongoose";

import IShift from "../../types/shift/shiftInterface";

//SERVES ONLY AS A TEMPLATE
//DATA WILL BE COMPRISE MOSTLY OF SCHEDULED SHIFTS
const shiftSchema: Schema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, `Shift position required.`],
      enum: [`general manager`, `assistant manager`, `lead`, `barista`],
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
      min: 0, //SUNDAY
      max: 6, //SATURDAY
    },
    shiftStart: {
      type: [
        { type: Number, min: 0, max: 23 }, //HOUR
        { type: Number, min: 0, max: 59 }, //MINUTE
      ],
      required: [true, `Shift start required.`],
    },
    shiftEnd: {
      type: [
        { type: Number, min: 0, max: 23 }, //HOUR
        { type: Number, min: 0, max: 59 }, //MINUTE
      ],
      required: [true, `Shift start required.`],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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

//WEEKLY SHIFT
shiftSchema.virtual(`weeklyShift`, {
  ref: `WeeklyShift`,
  foreignField: `shiftDay1`,
  localField: `_id`,
});
shiftSchema.virtual(`weeklyShift`, {
  ref: `WeeklyShift`,
  foreignField: `shiftDay2`,
  localField: `_id`,
});
shiftSchema.virtual(`weeklyShift`, {
  ref: `WeeklyShift`,
  foreignField: `shiftDay3`,
  localField: `_id`,
});
shiftSchema.virtual(`weeklyShift`, {
  ref: `WeeklyShift`,
  foreignField: `shiftDay4`,
  localField: `_id`,
});
shiftSchema.virtual(`weeklyShift`, {
  ref: `WeeklyShift`,
  foreignField: `shiftDay5`,
  localField: `_id`,
});

const Shift = mongoose.model<IShift>(`Shift`, shiftSchema);
export default Shift;
