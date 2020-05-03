import mongoose, { Schema } from "mongoose";

import IPreferred from "../../types/shift/preferredInterface";

//LIMITED 3 PER DAY OF THE WEEK FOR EACH EMPLOYEE
const preferredSchema: Schema = new mongoose.Schema(
  {
    shift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Shift`,
      required: [true, `Preferred shift must have a valid shift.`],
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Employee`,
      required: [true, `Preferred shift must belong to an employee.`],
    },
    rank: {
      type: Number,
      required: [true, `Preferred shift rank required.`],
      enum: [1, 2, 3],
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

//COMPOUND INDEX TO FIND IF PREFERRED SHIFT AND EMPLOYEE IS UNIQUE
preferredSchema.index({ shift: 1, employee: 1 }, { unique: true });

//SHOW IN FIND SHIFT & FIND EMPLOYEE
preferredSchema.pre(/^find/, function (this: any, next) {
  this.populate(`employee`).populate(`shift`);
  next();
});

const Preferred = mongoose.model<IPreferred>(`Preferred`, preferredSchema);
export default Preferred;
