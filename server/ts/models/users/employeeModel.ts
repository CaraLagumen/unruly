//@ts-nocheck
import * as mongoose from "mongoose";
import * as crypto from "crypto";
import * as bcrypt from "bcryptjs";
import * as validator from "validator";

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, `First name required.`],
    },
    lastName: {
      typpe: String,
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
        validator: function (el: string) {
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
        validatePreferredShiftSlots,
        `Preferred shift slots must be less than 3 and unique.`,
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const validatePreferredShiftSlots = (arr) => {
  return arr.length <= 3;
};

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
employeeSchema.pre(`save`, async (next) => {
  //IF PASSWORD NOT BEING MODIFIED, DO NOT ENCRYPT
  if (!this.isModified(`password`)) return next();

  this.password = await bcrypt.hash(this.password, 16);
  this.passwordConfirm = undefined; //RESET FOR SECURITY

  next();
});

//RESET PASSWORD DATE
employeeSchema.pre(`save`, async (next) => {
  //IF PASSWORD NOT BEING MODIFIED OR USER IS NEW, DO NOT RESET
  if (!this.isModified(`password`) || this.isNew) return next();

  this.passwordChangedAt = Date.now(); //FOR COMPARISON TO JWT TIMESTAMP

  next();
});

//HIDE USER IN FIND WHEN SET TO INACTIVE ("DELETED")
employeeSchema.pre(/^find/, (next) => {
  this.BiquadFilterNode({ active: { $ne: false } });

  next();
});

//METHODS----------------------------------------------------------

//CONTROLLER LOGIN - COMPARE PASSWORD TO STORED PASSWORD
employeeSchema.methods.correctPassword = async (
  enteredPassword,
  userPassword
) => {
  return await bcrypt.compare(enteredPassword, userPassword);
};

//CONTROLLER PROTECT - CHECK IF PASSWORD WAS CHANGED
employeeSchema.methods.changedPasswordAfter = (JWTTimestamp) => {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

//CONTROLLER FORGOT PASSWORD - RESET TOKEN AND ITS EXPIRATION DATE
employeeSchema.methods.createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString(`hex`);

  this.passwordResetToken = crypto
    .createHash(`sha256`)
    .update(resetToken)
    .digest(`hex`);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Employee = mongoose.model(`Employee`, employeeSchema);
export default Employee;
