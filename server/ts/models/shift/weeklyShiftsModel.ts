import mongoose, { Schema } from "mongoose";

import IWeeklyShifts from "../../types/shift/weeklyShiftsInterface";

//SERVES ONLY AS A TEMPLATE
//FOR WEEKLY SCHEDULED - AN ARRAY OF SHIFTS
const weeklyShiftsSchema: Schema = new mongoose.Schema(
  {
    weeklyShift: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: `Shift`,
          required: [true, `Weekly shifts must use valid shifts.`],
        },
      ],
      minlength: 5,
      maxlength: 5,
      required: [true, `Weekly shifts must be valid.`]
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//VIRTUAL POPULATE----------------------------------------------------------

//WEEKLY SCHEDULED
weeklyShiftsSchema.virtual(`weeklyScheduled`, {
  ref: `WeeklyScheduled`,
  foreignField: `weeklyShifts`,
  localField: `_id`,
});

const WeeklyShifts = mongoose.model<IWeeklyShifts>(
  `WeeklyShifts`,
  weeklyShiftsSchema
);
export default WeeklyShifts;
