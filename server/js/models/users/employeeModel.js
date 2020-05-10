"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validator_1 = __importDefault(require("validator"));
const customValidate = {
    equal2Items: function (arr) {
        return arr.length === 2;
    },
    max3Items: function (arr) {
        return arr.length <= 3;
    },
    uniqueArr: function (arr) {
        const duplicates = arr.filter((el, i, arrRef) => arrRef.indexOf(el) !== i);
        return duplicates.length === 0;
    },
};
const employeeSchema = new mongoose_1.default.Schema({
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
        validate: [validator_1.default.isEmail, `Email invalid.`],
    },
    password: {
        type: String,
        required: [true, `Password required.`],
    },
    passwordConfirm: {
        type: String,
        required: [true, `Confirm your password.`],
        validate: {
            validator: function (el) {
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
        select: false,
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
            {
                validator: customValidate.max3Items,
                msg: `Preferred shift slots must have less than or equal to 3 options.`,
            },
            {
                validator: customValidate.uniqueArr,
                msg: `Preferred shift slots must be unique.`,
            },
        ],
    },
    preferredDaysOff: {
        type: [{ type: Number, min: 0, max: 6, unique: true }],
        validate: [
            {
                validator: customValidate.equal2Items,
                msg: `Preferred days off must have less than or equal to 2 options.`,
            },
            {
                validator: customValidate.uniqueArr,
                msg: `Preferred days off must be unique.`,
            },
        ],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
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
employeeSchema.pre(`save`, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        //IF PASSWORD NOT BEING MODIFIED, DO NOT ENCRYPT
        if (!this.isModified(`password`))
            return next();
        this.password = yield bcryptjs_1.default.hash(this.password, 16);
        this.passwordConfirm = undefined; //RESET FOR SECURITY
        next();
    });
});
//RESET PASSWORD DATE
employeeSchema.pre(`save`, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        //IF PASSWORD NOT BEING MODIFIED OR EMPLOYEE IS NEW, DO NOT RESET
        if (!this.isModified(`password`) || this.isNew)
            return next();
        this.passwordChangedAt = Date.now(); //FOR COMPARISON TO JWT TIMESTAMP
        next();
    });
});
//HIDE EMPLOYEE IN FIND WHEN SET TO INACTIVE ("DELETED")
employeeSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});
//METHODS----------------------------------------------------------
//CONTROLLER LOGIN - COMPARE PASSWORD TO STORED PASSWORD
employeeSchema.methods.correctPassword = function (enteredPassword, employeePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(enteredPassword, employeePassword);
    });
};
//CONTROLLER PROTECT - CHECK IF PASSWORD WAS CHANGED
employeeSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = this.passwordChangedAt.getTime() / 1000;
        return JWTTimestamp < changedTimeStamp;
    }
    return false;
};
//CONTROLLER FORGOT PASSWORD - RESET TOKEN AND ITS EXPIRATION DATE
employeeSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString(`hex`);
    this.passwordResetToken = crypto_1.default
        .createHash(`sha256`)
        .update(resetToken)
        .digest(`hex`);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const Employee = mongoose_1.default.model(`Employee`, employeeSchema);
exports.default = Employee;
