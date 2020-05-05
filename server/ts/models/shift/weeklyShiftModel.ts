import mongoose, { Schema } from "mongoose";

import IWeeklyShift from "../../types/shift/weeklyShiftInterface";

//SERVES ONLY AS A TEMPLATE
//FOR WEEKLY SCHEDULED - AN ARRAY OF SHIFTS
const weeklyShiftSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `Weekly shift name required.`],
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
      enum: [
        `rotunda`,
        `food court`,
        `castle coffee 1`,
        `castle coffee 2`,
        `pool`,
      ],
    },
    shiftDay1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Shift`,
      required: [true, `Weekly shifts must use unique and valid shifts.`],
    },
    shiftDay2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Shift`,
      required: [true, `Weekly shifts must use unique and valid shifts.`],
    },
    shiftDay3: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Shift`,
      required: [true, `Weekly shifts must use unique and valid shifts.`],
    },
    shiftDay4: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Shift`,
      required: [true, `Weekly shifts must use unique and valid shifts.`],
    },
    shiftDay5: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Shift`,
      required: [true, `Weekly shifts must use unique and valid shifts.`],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//COMPOUND INDEX TO FIND IF WEEKLY SHIFT NAME AND SHIFT DAYS ARE UNIQUE
weeklyShiftSchema.index(
  {
    name: 1,
    shiftDay1: 1,
    shiftDay2: 1,
    shiftDay3: 1,
    shiftDay4: 1,
    shiftDay5: 1,
  },
  { unique: true }
);

//SHOW IN FIND: SHIFT
weeklyShiftSchema.pre(/^find/, function (this: any, next) {
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

const weeklyShift = mongoose.model<IWeeklyShift>(
  `weeklyShift`,
  weeklyShiftSchema
);
export default weeklyShift;
