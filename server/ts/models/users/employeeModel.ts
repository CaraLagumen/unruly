import mongoose, { Schema, Model } from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import validator from "validator";

import IEmployee from "../../types/users/employeeInterface";

const customValidate = {
  max3Items: function (arr: []) {
    return arr.length <= 3;
  },
};

const employeeSchema: Schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, `First name required.`],
    },
    lastName: {
      type: String,
      required: [true, `Last name required.`],
    },
    email: {
      type: String,
      required: [true, `Email required.`],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, `Email invalid.`],
    },
    password: {
      type: String,
      required: [true, `Password required.`],
    },
    passwordConfirm: {
      type: String,
      required: [true, `Confirm your password.`],
      validate: {
        validator: function (this: IEmployee, el: string) {
          return el === this.password;
        },
        message: `Passwords not the same.`,
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false, //HIDDEN
    },
    position: {
      type: String,
      required: [true, `Position required.`],
      enum: [`general manager`, `assistant manager`, `lead`, `barista`],
    },
    status: {
      type: String,
      required: [true, `Status required.`],
      enum: [`full-time`, `part-time`, `on-call`],
    },
    seniority: {
      type: Number,
      required: [true, `Seniority required.`],
    },
    hireDate: {
      type: Date,
      required: [true, `Hire date required.`],
    },
    preferredShiftSlots: {
      type: [
        {
          type: String,
          enum: [`morning`, `day`, `swing`, `graveyard`],
          unique: true,
        },
      ],
      validate: [
        customValidate.max3Items,
        `Preferred shift slots must be less than 3 and unique.`,
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//VIRTUAL POPULATE----------------------------------------------------------

//PREFERRED
employeeSchema.virtual(`preferred`, {
  ref: `Preferred`,
  foreignField: `employee`,
  localField: `_id`,
});

//SCHEDULED
employeeSchema.virtual(`scheduled`, {
  ref: `Scheduled`,
  foreignField: `employee`,
  localField: `_id`,
});

//MIDDLEWARES----------------------------------------------------------

//ENCRYPT PASSWORD
employeeSchema.pre(`save`, async function (this: IEmployee, next) {
  //IF PASSWORD NOT BEING MODIFIED, DO NOT ENCRYPT
  if (!this.isModified(`password`)) return next();

  this.password = await bcrypt.hash(<string>this.password, 16);
  this.passwordConfirm = undefined; //RESET FOR SECURITY

  next();
});

//RESET PASSWORD DATE
employeeSchema.pre(`save`, async function (this: IEmployee, next) {
  //IF PASSWORD NOT BEING MODIFIED OR EMPLOYEE IS NEW, DO NOT RESET
  if (!this.isModified(`password`) || this.isNew) return next();

  this.passwordChangedAt = Date.now(); //FOR COMPARISON TO JWT TIMESTAMP

  next();
});

//HIDE EMPLOYEE IN FIND WHEN SET TO INACTIVE ("DELETED")
employeeSchema.pre(/^find/, function (this: Model<IEmployee>, next) {
  this.find({ active: { $ne: false } });

  next();
});

//METHODS----------------------------------------------------------

//CONTROLLER LOGIN - COMPARE PASSWORD TO STORED PASSWORD
employeeSchema.methods.correctPassword = async function (
  enteredPassword: string,
  employeePassword: string
) {
  return await bcrypt.compare(enteredPassword, employeePassword);
};

//CONTROLLER PROTECT - CHECK IF PASSWORD WAS CHANGED
employeeSchema.methods.changedPasswordAfter = function (
  this: IEmployee,
  JWTTimestamp: number
) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = this.passwordChangedAt.getTime() / 1000;

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

//CONTROLLER FORGOT PASSWORD - RESET TOKEN AND ITS EXPIRATION DATE
employeeSchema.methods.createPasswordResetToken = function (this: IEmployee) {
  const resetToken = crypto.randomBytes(32).toString(`hex`);

  this.passwordResetToken = crypto
    .createHash(`sha256`)
    .update(resetToken)
    .digest(`hex`);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Employee = mongoose.model<IEmployee>(`Employee`, employeeSchema);
export default Employee;
