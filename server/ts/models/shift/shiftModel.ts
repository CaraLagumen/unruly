import mongoose, { Schema } from "mongoose";

import IShift from "../../types/shift/shiftInterface";

//SERVES ONLY AS A TEMPLATE
//DATA WILL BE COMPRISE MOSTLY OF SCHEDULED SHIFTS
const shiftSchema: Schema = new mongoose.Schema(
  {
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
      min: 0, //SUNDAY
      max: 6, //SATURDAY
    },
    hours: {
      type: [
        { type: Number, min: 0, max: 23 }, //SHIFT START
        { type: Number, min: 0, max: 23 }, //SHIFT END
      ],
      required: [true, `Shift hours required.`],
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

export const Shift = mongoose.model<IShift>(`Shift`, shiftSchema);
