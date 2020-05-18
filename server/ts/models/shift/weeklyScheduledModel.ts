import mongoose, { Schema } from "mongoose";

import IWeeklyScheduled from "../../types/shift/weeklyScheduledInterface";

//FOR FULL-TIMERS - MUST CREATE INDIVIDUAL SCHEDULED SHIFTS FROM THIS MODEL
const weeklyScheduledSchema: Schema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Employee`,
      required: [true, `Weekly scheduled shifts must belong to an employee.`],
      unique: true,
    },
    scheduler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Scheduler`,
      required: [true, `Weekly scheduled shifts must have a scheduler.`],
    },
    weeklyShift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `WeeklyShift`,
      required: [true, `Weekly scheduled shifts must have valid weekly shift.`],
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

//SHOW IN FIND: EMPLOYEE, SCHEDULER, AND WEEKLYSHIFT
weeklyScheduledSchema.pre(/^find/, function (this: any, next) {
  this.populate(`employee`).populate(`scheduler`).populate(`weeklyShift`);
  next();
});

const WeeklyScheduled = mongoose.model<IWeeklyScheduled>(
  `WeeklyScheduled`,
  weeklyScheduledSchema
);
export default WeeklyScheduled;
