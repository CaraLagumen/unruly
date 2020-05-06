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

//COMPOUND INDEX TO FIND IF WEEKLY SCHEDULED EMPLOYEE, SCHEDULER, AND WEEKLY SHIFT IS UNIQUE
weeklyScheduledSchema.index(
  { employee: 1, scheduler: 1, weeklyShift: 1 },
  { unique: true }
);

//SHOW IN FIND: EMPLOYEE AND SCHEDULER
weeklyScheduledSchema.pre(/^find/, function (this: any, next) {
  this.populate(`employee`).populate(`scheduler`);
  next();
});

const WeeklyScheduled = mongoose.model<IWeeklyScheduled>(
  `WeeklyScheduled`,
  weeklyScheduledSchema
);
export default WeeklyScheduled;
