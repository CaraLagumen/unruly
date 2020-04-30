//@ts-nocheck
import * as mongoose from "mongoose";

//MOST CREATED DATA
const scheduledSchema = new mongoose.Schema(
  {
    shift: {
      type: mongoose.Schema.ObjectId,
      ref: `Shift`,
      required: [true, `Scheduled shift must be a valid shift.`],
    },
    employee: {
      type: mongoose.Schema.ObjectId,
      ref: `Employee`,
      required: [true, `Scheduled shift must belong to an employee.`],
    },
    scheduler: {
      type: mongoose.Schema.ObjectId,
      ref: `Scheduler`,
      required: [true, `Scheduled shift must have a scheduler.`],
    },
    date: {
      type: Date,
      required: [true, `Scheduled shift date required.`],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //HIDDEN
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//COMPOUND INDEX TO FIND IF SCHEDULED SHIFT AND EMPLOYEE IS UNIQUE
scheduledSchema.index(
  { shift: 1, employee: 1, scheduler: 1 },
  { unique: true }
);

//SHOW IN FIND EMPLOYEE & FIND SCHEDULER
scheduledSchema.pre(/^find/, (next) => {
  this.populate(`employee`).populate(`scheduler`);
  next();
});

export const Scheduled = mongoose.model(`Scheduled`, scheduledSchema);
