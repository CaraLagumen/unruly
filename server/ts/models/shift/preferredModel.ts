//@ts-nocheck
import * as mongoose from "mongoose";

//LIMITED 3 PER DAY OF THE WEEK FOR EACH EMPLOYEE
const preferredSchema = new mongoose.Schema(
  {
    shift: {
      type: mongoose.Schema.ObjectId,
      ref: `Shift`,
      required: [true, `Preferred shift must have a valid shift.`],
    },
    employee: {
      type: mongoose.Schema.ObjectId,
      ref: `Employee`,
      required: [true, `Preferred shift must belong to an employee.`],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //HIDDEN
    },
    rank: {
      type: Number,
      required: [true, `Preferred shift rank required.`],
      enum: [1, 2, 3],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//COMPOUND INDEX TO FIND IF PREFERRED SHIFT AND EMPLOYEE IS UNIQUE
preferredSchema.index({ shift: 1, employee: 1 }, { unique: true });

//SHOW IN FIND SHIFT & FIND EMPLOYEE
preferredSchema.pre(/^find/, (next) => {
  this.populate(`shift`).populate(`employee`);
  next();
});

export const Preferred = mongoose.model(`Preferred`, preferredSchema);
