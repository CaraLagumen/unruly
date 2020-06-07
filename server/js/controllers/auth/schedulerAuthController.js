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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = require("util");
const crypto_1 = __importDefault(require("crypto"));
const schedulerModel_1 = __importDefault(require("../../models/users/schedulerModel"));
const email_1 = __importDefault(require("../../utils/email"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
//TOOLS----------------------------------------------------------
//SETUP SESSION TOKEN TO BE ATTACHED
const sessionToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
//CREATE COOKIE AND ATTACK SESSION TOKEN
const createSendToken = (user, statusCode, req, res) => {
    //1. SETUP COOKIE PARAMS
    const token = sessionToken(user._id);
    const expireTime = process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000;
    const cookieOptions = {
        expires: new Date(Date.now() + expireTime),
        httpOnly: true,
        secure: req.secure || req.headers[`x-forwarded-proto`] === `https`,
    };
    //2. SEND COOKIE
    res.cookie(`jwt`, token, cookieOptions);
    //3. REMOVE PASSWORD FROM OUTPUT FOR PRIVACY
    user.password = undefined;
    //4. SEND SCHEDULER WITH COOKIE AND SESSION TOKEN
    res.status(statusCode).json({
        status: `success`,
        token,
        user,
        userType: `scheduler`,
        expiresIn: 1209600,
    });
};
//MAIN----------------------------------------------------------
//REGISTER
exports.register = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GRAB SCHEDULER PROPERTIES
    const newScheduler = yield schedulerModel_1.default.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    //2. PREPARE URL FOR EMAIL THEN SEND EMAIL
    const url = `${req.protocol}://${req.get(`host`)}/`;
    yield new email_1.default(newScheduler, url).sendWelcome();
    //3. REGISTER NEW SCHEDULER WITH SESSION TOKEN
    createSendToken(newScheduler, 201, req, res);
}));
//LOGIN
exports.login = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GRAB EMAIL AND PASSWORD
    const { email, password } = req.body;
    //2. ERROR IF EMAIL AND/OR PASSWORD DOES NOT EXIST
    if (!email || !password) {
        return next(new appError_1.default(`Please provide an email and/or password`, 400));
    }
    //3. CHECK IF SCHEDULER EXISTS AND PASSWORD MATCHES
    const scheduler = yield schedulerModel_1.default.findOne({ email }).select(`+password`);
    if (!scheduler ||
        !(yield scheduler.correctPassword(password, scheduler.password))) {
        return next(new appError_1.default(`Incorrect email and/or password.`, 401));
    }
    //4. LOGIN SCHEDULER WITH SESSION TOKEN
    createSendToken(scheduler, 200, req, res);
}));
//LOGOUT
exports.logout = (req, res) => {
    res.cookie(`jwt`, `loggedout`, {
        //OVERWRITE COOKIE FOR LOGOUT
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: `success` });
};
//MIDDLEWARES----------------------------------------------------------
//RESTRICTIONS IF ANY
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        //RESTRICT ACCESS IF ROLE NOT INCLUDED
        if (!roles.includes(req.scheduler.role)) {
            return next(new appError_1.default(`You do not have permission to perform this action.`, 403));
        }
        next();
    };
};
//STATE CHECK
exports.protect = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. CHECK IF TOKEN EXISTS
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith(`Bearer`)) {
        token = req.headers.authorization.split(` `)[1];
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new appError_1.default(`You are not logged in.`, 401));
    }
    //2. VERIFY TOKEN
    const decoded = yield util_1.promisify(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET);
    //3. CHECK IF SCHEDULER EXISTS
    const currentScheduler = yield schedulerModel_1.default.findById(decoded.id);
    if (!currentScheduler) {
        return next(new appError_1.default(`This token is invalid.`, 401));
    }
    //4. CHECK IF SCHEDULER CHANGED PASSWORD AFTER JWT ISSUED
    // if (currentScheduler.changedPasswordAfter(decoded.iat)) {
    //   return next(
    //     new AppError(
    //       `Scheduler recently changed password. Please log in again.`,
    //       401
    //     )
    //   );
    // }
    //5. GRANT ACCESS
    req.scheduler = currentScheduler;
    res.locals.scheduler = currentScheduler;
    next();
}));
//FORGOT PASSWORD
exports.forgotPassword = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GET SCHEDULER BASED ON POSTED EMAIL
    const scheduler = yield schedulerModel_1.default.findOne({ email: req.body.email });
    if (!scheduler) {
        return next(new appError_1.default(`There is no scheduler with that email address.`, 404));
    }
    //2. GENERATE RANDOM RESET TOKEN
    const resetToken = scheduler.createPasswordResetToken();
    yield scheduler.save({ validateBeforeSave: false });
    try {
        //3. SEND TO SCHEDULER'S EMAIL
        const resetURL = `${req.protocol}://${req.get(`host`)}/#/auth/scheduler/reset/${resetToken}`;
        yield new email_1.default(scheduler, resetURL).sendPasswordReset();
        res.status(200).json({
            status: `success`,
            message: `Token sent to email.`,
        });
    }
    catch (err) {
        //4. SET UNDEFINED IF ERROR
        scheduler.passwordResetToken = undefined;
        scheduler.passwordResetExpires = undefined;
        yield scheduler.save({ validateBeforeSave: false });
        return next(new appError_1.default(`There was an error sending the email. Try again later.`, 500));
    }
}));
//RESET PASSWORD
exports.resetPassword = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GET SCHEDULER BASED ON TOKEN
    const hashedToken = crypto_1.default
        .createHash(`sha256`)
        .update(req.params.token)
        .digest(`hex`);
    const scheduler = yield schedulerModel_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    //2. SET NEW PASSWORD IF TOKEN NOT EXPIRED AND SCHEDULER EXISTS
    if (!scheduler) {
        return next(new appError_1.default(`Token is invalid or has expired`, 400));
    }
    scheduler.password = req.body.password;
    scheduler.passwordConfirm = req.body.passwordConfirm;
    scheduler.passwordResetToken = undefined;
    scheduler.passwordResetExpires = undefined;
    //3. UPDATE changedPasswordAt PROP FOR SCHEDULER
    yield scheduler.save();
    //4. LOG SCHEDULER IN AND SEND JWT
    createSendToken(scheduler, 200, req, res);
}));
//UPDATE PASSWORD
exports.updatePassword = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GET SCHEDULER FROM COLLECTION
    const scheduler = (yield schedulerModel_1.default.findById(req.scheduler.id).select(`+password`));
    //2. CHECK IF POSTED CURRENT PASSWORD CORRECT
    if (!(yield scheduler.correctPassword(req.body.passwordCurrent, scheduler.password))) {
        return next(new appError_1.default(`The password entered is incorrect.`, 401));
    }
    //3. IF SO, UPDATE PASSWORD
    scheduler.password = req.body.password;
    scheduler.passwordConfirm = req.body.passwordConfirm;
    yield scheduler.save();
    //4. LOG SCHEDULER IN AND SEND JWT
    createSendToken(scheduler, 200, req, res);
}));
//PUBLIC USE----------------------------------------------------------
//DISPLAY IF LOGGED IN
exports.isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. CHECK IF TOKEN EXISTS
    if (req.cookies.jwt) {
        try {
            //2. VERIFY TOKEN
            const decoded = yield util_1.promisify(jsonwebtoken_1.default.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            //3. CHECK IF SCHEDULER STILL EXISTS
            const currentScheduler = yield schedulerModel_1.default.findById(decoded.id);
            if (!currentScheduler) {
                return next();
            }
            //4. CHECK IF SCHEDULER CHANGED PASSWORD AFTER JWT ISSUED
            if (currentScheduler.changedPasswordAfter(decoded.iat)) {
                return next();
            }
            //5. THERE IS A LOGGED IN SCHEDULER
            res.locals.scheduler = currentScheduler;
            return next();
        }
        catch (err) {
            return next();
        }
    }
    next();
});
//ALLOW DISPLAY OF SCHEDULER PROPERTIES
exports.displayScheduler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //1. CHECK IF TOKEN EXISTS
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith(`Bearer`)) {
            token = req.headers.authorization.split(` `)[1];
        }
        else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        else {
            return next();
        }
        if (!token) {
            return next(new appError_1.default(`You are not logged in.`, 401));
        }
        //2. VERIFY TOKEN
        const decoded = yield util_1.promisify(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET);
        //3. CHECK IF SCHEDULER EXISTS
        const currentScheduler = yield schedulerModel_1.default.findById(decoded.id);
        if (!currentScheduler) {
            return next(new appError_1.default(`This token is invalid.`, 401));
        }
        //4. CHECK IF SCHEDULER CHANGED PASSWORD AFTER JWT ISSUED
        // if (currentScheduler.changedPasswordAfter(decoded.iat)) {
        //   return next(
        //     new AppError(
        //       `Scheduler recently changed password. Please log in again.`,
        //       401
        //     )
        //   );
        // }
        //5. GRANT ACCESS
        req.scheduler = currentScheduler;
        res.locals.scheduler = currentScheduler;
        next();
    }
    catch (err) {
        return next();
    }
});
