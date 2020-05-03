import mongoose, { Schema } from "mongoose";

import IWeeklyScheduled from "../../types/shift/weeklyScheduledInterface";

//FOR FULL-TIMERS - MUST CREATE INDIVIDUAL SCHEDULED SHIFTS FROM THIS MODEL
const weeklyScheduledSchema: Schema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Employee`,
      required: [true, `Weekly scheduled shifts must belong to an employee.`],
    },
    scheduler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Scheduler`,
      required: [true, `Weekly scheduled shifts must have a scheduler.`],
    },
    weeklyShifts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `WeeklyShifts`,
      required: [true, `Weekly scheduled shifts must have valid shifts.`],
    },
    startDate: {
      type: Date,
      required: [true, `Weekly scheduled shifts must have a start date.`],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//COMPOUND INDEX TO FIND IF SCHEDULED SHIFT AND EMPLOYEE IS UNIQUE
weeklyScheduledSchema.index(
  { employee: 1, scheduler: 1, weeklyShifts: 1 },
  { unique: true }
);

//SHOW IN FIND EMPLOYEE
weeklyScheduledSchema.pre(/^find/, function (this: any, next) {
  this.populate(`employee`).populate(`weeklyShifts`);
  next();
});

const WeeklyScheduled = mongoose.model<IWeeklyScheduled>(
  `WeeklyScheduled`,
  weeklyScheduledSchema
);
export default WeeklyScheduled;