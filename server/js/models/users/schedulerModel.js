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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const mongoose = __importStar(require("mongoose"));
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcryptjs"));
const validator = __importStar(require("validator"));
const schedulerSchema = new mongoose.Schema({
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
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
//VIRTUAL POPULATE----------------------------------------------------------
//SCHEDULED
schedulerSchema.virtual(`scheduled`, {
    ref: `Scheduled`,
    foreignField: `scheduler`,
    localField: `_id`,
});
//MIDDLEWARES----------------------------------------------------------
//ENCRYPT PASSWORD
schedulerSchema.pre(`save`, (next) => __awaiter(void 0, void 0, void 0, function* () {
    //IF PASSWORD NOT BEING MODIFIED, DO NOT ENCRYPT
    if (!this.isModified(`password`))
        return next();
    this.password = yield bcrypt.hash(this.password, 16);
    this.passwordConfirm = undefined; //RESET FOR SECURITY
    next();
}));
//RESET PASSWORD DATE
schedulerSchema.pre(`save`, (next) => __awaiter(void 0, void 0, void 0, function* () {
    //IF PASSWORD NOT BEING MODIFIED OR USER IS NEW, DO NOT RESET
    if (!this.isModified(`password`) || this.isNew)
        return next();
    this.passwordChangedAt = Date.now(); //FOR COMPARISON TO JWT TIMESTAMP
    next();
}));
//HIDE USER IN FIND WHEN SET TO INACTIVE ("DELETED")
schedulerSchema.pre(/^find/, (next) => {
    this.BiquadFilterNode({ active: { $ne: false } });
    next();
});
//METHODS----------------------------------------------------------
//CONTROLLER LOGIN - COMPARE PASSWORD TO STORED PASSWORD
schedulerSchema.methods.correctPassword = (enteredPassword, userPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.compare(enteredPassword, userPassword);
});
//CONTROLLER PROTECT - CHECK IF PASSWORD WAS CHANGED
schedulerSchema.methods.changedPasswordAfter = (JWTTimestamp) => {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimeStamp;
    }
    return false;
};
//CONTROLLER FORGOT PASSWORD - RESET TOKEN AND ITS EXPIRATION DATE
schedulerSchema.methods.createPasswordResetToken = () => {
    const resetToken = crypto.randomBytes(32).toString(`hex`);
    this.passwordResetToken = crypto
        .createHash(`sha256`)
        .update(resetToken)
        .digest(`hex`);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const Scheduler = mongoose.model(`Scheduler`, schedulerSchema);
exports.default = Scheduler;
