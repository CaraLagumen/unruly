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
const schedulerSchema = new mongoose_1.default.Schema({
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
schedulerSchema.pre(`save`, function (next) {
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
schedulerSchema.pre(`save`, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        //IF PASSWORD NOT BEING MODIFIED OR USER IS NEW, DO NOT RESET
        if (!this.isModified(`password`) || this.isNew)
            return next();
        this.passwordChangedAt = Date.now(); //FOR COMPARISON TO JWT TIMESTAMP
        next();
    });
});
//HIDE USER IN FIND WHEN SET TO INACTIVE ("DELETED")
schedulerSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});
//METHODS----------------------------------------------------------
//CONTROLLER LOGIN - COMPARE PASSWORD TO STORED PASSWORD
schedulerSchema.methods.correctPassword = function (enteredPassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(enteredPassword, userPassword);
    });
};
//CONTROLLER PROTECT - CHECK IF PASSWORD WAS CHANGED
schedulerSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = this.passwordChangedAt.getTime() / 1000;
        return JWTTimestamp < changedTimeStamp;
    }
    return false;
};
//CONTROLLER FORGOT PASSWORD - RESET TOKEN AND ITS EXPIRATION DATE
schedulerSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString(`hex`);
    this.passwordResetToken = crypto_1.default
        .createHash(`sha256`)
        .update(resetToken)
        .digest(`hex`);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const Scheduler = mongoose_1.default.model(`Scheduler`, schedulerSchema);
exports.default = Scheduler;
