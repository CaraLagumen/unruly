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
const employeeModel_1 = __importDefault(require("../../models/users/employeeModel"));
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
    //4. SEND EMPLOYEE WITH COOKIE AND SESSION TOKEN
    res.status(statusCode).json({
        status: `success`,
        token,
        user,
        userType: `employee`,
        expiresIn: 1209600,
    });
};
//MAIN----------------------------------------------------------
//REGISTER
exports.register = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GRAB EMPLOYEE PROPERTIES
    const newEmployee = yield employeeModel_1.default.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        position: req.body.position,
        status: req.body.status,
        seniority: req.body.seniority,
        hireDate: req.body.hireDate,
        preferredShiftSlots: req.body.preferredShiftSlots,
        preferredDaysOff: req.body.preferredDaysOff,
    });
    //2. PREPARE URL FOR EMAIL THEN SEND EMAIL
    const url = `${req.protocol}://${req.get(`host`)}/`;
    yield new email_1.default(newEmployee, url).sendWelcome();
    //3. REGISTER NEW EMPLOYEE WITH SESSION TOKEN
    createSendToken(newEmployee, 201, req, res);
}));
//LOGIN
exports.login = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GRAB EMAIL AND PASSWORD
    const { email, password } = req.body;
    //2. ERROR IF EMAIL AND/OR PASSWORD DOES NOT EXIST
    if (!email || !password) {
        return next(new appError_1.default(`Please provide an email and/or password`, 400));
    }
    //3. CHECK IF EMPLOYEE EXISTS AND PASSWORD MATCHES
    const employee = yield employeeModel_1.default.findOne({ email }).select(`+password`);
    if (!employee ||
        !(yield employee.correctPassword(password, employee.password))) {
        return next(new appError_1.default(`Incorrect email and/or password.`, 401));
    }
    //4. LOGIN EMPLOYEE WITH SESSION TOKEN
    createSendToken(employee, 200, req, res);
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
        if (!roles.includes(req.employee.role)) {
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
    //3. CHECK IF EMPLOYEE EXISTS
    const currentEmployee = yield employeeModel_1.default.findById(decoded.id);
    if (!currentEmployee) {
        return next(new appError_1.default(`This token is invalid.`, 401));
    }
    //4. CHECK IF EMPLOYEE CHANGED PASSWORD AFTER JWT ISSUED
    if (currentEmployee.changedPasswordAfter(decoded.iat)) {
        return next(new appError_1.default(`Employee recently changed password. Please log in again.`, 401));
    }
    //5. GRANT ACCESS
    req.employee = currentEmployee;
    res.locals.employee = currentEmployee;
    next();
}));
//FORGOT PASSWORD
exports.forgotPassword = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GET EMPLOYEE BASED ON POSTED EMAIL
    const employee = yield employeeModel_1.default.findOne({ email: req.body.email });
    if (!employee) {
        return next(new appError_1.default(`There is no employee with that email address.`, 404));
    }
    //2. GENERATE RANDOM RESET TOKEN
    const resetToken = employee.createPasswordResetToken();
    yield employee.save({ validateBeforeSave: false });
    try {
        //3. SEND TO EMPLOYEE'S EMAIL
        const resetURL = `${req.protocol}://${req.get(`host`)}/#/auth/reset/${resetToken}`;
        yield new email_1.default(employee, resetURL).sendPasswordReset();
        res.status(200).json({
            status: `success`,
            message: `Token sent to email.`,
        });
    }
    catch (err) {
        //4. SET UNDEFINED IF ERROR
        employee.passwordResetToken = undefined;
        employee.passwordResetExpires = undefined;
        yield employee.save({ validateBeforeSave: false });
        return next(new appError_1.default(`There was an error sending the email. Try again later.`, 500));
    }
}));
//RESET PASSWORD
exports.resetPassword = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GET EMPLOYEE BASED ON TOKEN
    const hashedToken = crypto_1.default
        .createHash(`sha256`)
        .update(req.params.token)
        .digest(`hex`);
    const employee = yield employeeModel_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    //2. SET NEW PASSWORD IF TOKEN NOT EXPIRED AND EMPLOYEE EXISTS
    if (!employee) {
        return next(new appError_1.default(`Token is invalid or has expired`, 400));
    }
    employee.password = req.body.password;
    employee.passwordConfirm = req.body.passwordConfirm;
    employee.passwordResetToken = undefined;
    employee.passwordResetExpires = undefined;
    //3. UPDATE changedPasswordAt PROP FOR EMPLOYEE
    yield employee.save();
    //4. LOG EMPLOYEE IN AND SEND JWT
    createSendToken(employee, 200, req, res);
}));
//UPDATE PASSWORD
exports.updatePassword = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GET EMPLOYEE FROM COLLECTION
    const employee = yield employeeModel_1.default.findById(req.employee.id).select(`+password`);
    //2. CHECK IF POSTED CURRENT PASSWORD CORRECT
    if (!(yield employee.correctPassword(req.body.passwordCurrent, employee.password))) {
        return next(new appError_1.default(`The password entered is incorrect.`, 401));
    }
    //3. IF SO, UPDATE PASSWORD
    employee.password = req.body.password;
    employee.passwordConfirm = req.body.passwordConfirm;
    yield employee.save();
    //4. LOG EMPLOYEE IN AND SEND JWT
    createSendToken(employee, 200, req, res);
}));
//PUBLIC USE----------------------------------------------------------
//DISPLAY IF LOGGED IN
exports.isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. CHECK IF TOKEN EXISTS
    if (req.cookies.jwt) {
        try {
            //2. VERIFY TOKEN
            const decoded = yield util_1.promisify(jsonwebtoken_1.default.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            //3. CHECK IF EMPLOYEE STILL EXISTS
            const currentEmployee = yield employeeModel_1.default.findById(decoded.id);
            if (!currentEmployee) {
                return next();
            }
            //4. CHECK IF EMPLOYEE CHANGED PASSWORD AFTER JWT ISSUED
            if (currentEmployee.changedPasswordAfter(decoded.iat)) {
                return next();
            }
            //5. THERE IS A LOGGED IN EMPLOYEE
            res.locals.employee = currentEmployee;
            return next();
        }
        catch (err) {
            return next();
        }
    }
    next();
});
//ALLOW DISPLAY OF EMPLOYEE PROPERTIES
exports.displayEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        //3. CHECK IF EMPLOYEE EXISTS
        const currentEmployee = yield employeeModel_1.default.findById(decoded.id);
        if (!currentEmployee) {
            return next(new appError_1.default(`This token is invalid.`, 401));
        }
        //4. CHECK IF EMPLOYEE CHANGED PASSWORD AFTER JWT ISSUED
        if (currentEmployee.changedPasswordAfter(decoded.iat)) {
            return next(new appError_1.default(`Employee recently changed password. Please log in again.`, 401));
        }
        //5. GRANT ACCESS
        req.employee = currentEmployee;
        res.locals.employee = currentEmployee;
        next();
    }
    catch (err) {
        return next();
    }
});
