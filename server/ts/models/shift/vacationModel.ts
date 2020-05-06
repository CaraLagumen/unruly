import mongoose, { Schema } from "mongoose";

import IVacation from "../../types/shift/vacationInterface";

//LIMITED 3 PER DAY OF THE WEEK FOR EACH EMPLOYEE
const vacationSchema: Schema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Employee`,
      required: [true, `Vacation must belong to an employee.`],
    },
    scheduler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Scheduler`,
    },
    date: {
      type: Date,
      required: [true, `Vacation date required.`],
    },
    approved: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      // select: false, //HIDDEN
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//COMPOUND INDEX TO FIND IF VACATION EMPLOYEE, SCHEDULER, AND DATE IS UNIQUE
vacationSchema.index({ employee: 1, scheduler: 1, date: 1 }, { unique: true });

//SHOW IN FIND: EMPLOYEE
vacationSchema.pre(/^find/, function (this: any, next) {
  this.populate(`employee`).populate(`scheduler`);
  next();
});

const Vacation = mongoose.model<IVacation>(`Vacation`, vacationSchema);
export default Vacation;
