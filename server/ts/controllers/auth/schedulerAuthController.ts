import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import crypto from "crypto";

import Scheduler from "../../models/users/schedulerModel";
import IScheduler from "../../types/users/schedulerInterface";
import Email from "../../utils/email";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";

//TOOLS----------------------------------------------------------

//SETUP SESSION TOKEN TO BE ATTACHED
const sessionToken = (id: string) => {
  return jwt.sign({ id }, <jwt.Secret>process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//CREATE COOKIE AND ATTACK SESSION TOKEN
const createSendToken = (
  user: IScheduler,
  statusCode: number,
  req: Request,
  res: Response
) => {
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
    userType: `scheduler`, //DISPLAY FOR ANGULAR
    expiresIn: 1209600, //DISPLAY FOR ANGULAR
  });
};

//MAIN----------------------------------------------------------

//REGISTER
export const register = catchAsync(async (req, res, next) => {
  //1. GRAB SCHEDULER PROPERTIES
  const newScheduler = await Scheduler.create({
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
  });

  //2. PREPARE URL FOR EMAIL THEN SEND EMAIL
  const url = `${req.protocol}://${req.get(`host`)}/`;
  await new Email(newScheduler, url).sendWelcome();

  //3. REGISTER NEW SCHEDULER WITH SESSION TOKEN
  createSendToken(newScheduler, 201, req, res);
});

//LOGIN
export const login = catchAsync(async (req, res, next) => {
  //1. GRAB EMAIL AND PASSWORD
  const { email, password } = req.body;

  //2. ERROR IF EMAIL AND/OR PASSWORD DOES NOT EXIST
  if (!email || !password) {
    return next(new AppError(`Please provide an email and/or password`, 400));
  }

  //3. CHECK IF SCHEDULER EXISTS AND PASSWORD MATCHES
  const scheduler = await Scheduler.findOne({ email }).select(`+password`);
  if (
    !scheduler ||
    !(await scheduler.correctPassword(password, <string>scheduler.password))
  ) {
    return next(new AppError(`Incorrect email and/or password.`, 401));
  }

  //4. LOGIN SCHEDULER WITH SESSION TOKEN
  createSendToken(scheduler, 200, req, res);
});

//LOGOUT
export const logout = (req: Request, res: Response) => {
  res.cookie(`jwt`, `loggedout`, {
    //OVERWRITE COOKIE FOR LOGOUT
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: `success` });
};

//MIDDLEWARES----------------------------------------------------------

//RESTRICTIONS IF ANY
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //RESTRICT ACCESS IF ROLE NOT INCLUDED
    if (!roles.includes(req.scheduler.role)) {
      return next(
        new AppError(`You do not have permission to perform this action.`, 403)
      );
    }

    next();
  };
};

//STATE CHECK
export const protect = catchAsync(async (req, res, next) => {
  //1. CHECK IF TOKEN EXISTS
  let token;

  if (
    req.headers.authorization &&
    (<string>req.headers.authorization).startsWith(`Bearer`)
  ) {
    token = (<string>req.headers.authorization).split(` `)[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError(`You are not logged in.`, 401));
  }

  //2. VERIFY TOKEN
  const decoded = await promisify<Function>(<any>jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  //3. CHECK IF SCHEDULER EXISTS
  const currentScheduler = await Scheduler.findById(decoded.id);

  if (!currentScheduler) {
    return next(new AppError(`This token is invalid.`, 401));
  }

  //4. CHECK IF SCHEDULER CHANGED PASSWORD AFTER JWT ISSUED
  if (currentScheduler.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        `Scheduler recently changed password. Please log in again.`,
        401
      )
    );
  }

  //5. GRANT ACCESS
  req.scheduler = currentScheduler;
  res.locals.scheduler = currentScheduler;
  next();
});

//FORGOT PASSWORD
export const forgotPassword = catchAsync(async (req, res, next) => {
  //1. GET SCHEDULER BASED ON POSTED EMAIL
  const scheduler = await Scheduler.findOne({ email: req.body.email });
  if (!scheduler) {
    return next(
      new AppError(`There is no scheduler with that email address.`, 404)
    );
  }

  //2. GENERATE RANDOM RESET TOKEN
  const resetToken = scheduler.createPasswordResetToken();
  await scheduler.save({ validateBeforeSave: false });

  try {
    //3. SEND TO SCHEDULER'S EMAIL
    const resetURL = `${req.protocol}://${req.get(
      `host`
    )}/#/auth/reset/${resetToken}`;

    await new Email(scheduler, resetURL).sendPasswordReset();

    res.status(200).json({
      status: `success`,
      message: `Token sent to email.`,
    });
  } catch (err) {
    //4. SET UNDEFINED IF ERROR
    scheduler.passwordResetToken = undefined;
    scheduler.passwordResetExpires = undefined;

    await scheduler.save({ validateBeforeSave: false });

    return next(
      new AppError(
        `There was an error sending the email. Try again later.`,
        500
      )
    );
  }
});

//RESET PASSWORD
export const resetPassword = catchAsync(async (req, res, next) => {
  //1. GET SCHEDULER BASED ON TOKEN
  const hashedToken = crypto
    .createHash(`sha256`)
    .update(req.params.token)
    .digest(`hex`);

  const scheduler = await Scheduler.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2. SET NEW PASSWORD IF TOKEN NOT EXPIRED AND SCHEDULER EXISTS
  if (!scheduler) {
    return next(new AppError(`Token is invalid or has expired`, 400));
  }

  scheduler.password = req.body.password;
  scheduler.passwordConfirm = req.body.passwordConfirm;
  scheduler.passwordResetToken = undefined;
  scheduler.passwordResetExpires = undefined;

  //3. UPDATE changedPasswordAt PROP FOR SCHEDULER
  await scheduler.save();

  //4. LOG SCHEDULER IN AND SEND JWT
  createSendToken(scheduler, 200, req, res);
});

//UPDATE PASSWORD
export const updatePassword = catchAsync(async (req, res, next) => {
  //1. GET SCHEDULER FROM COLLECTION
  const scheduler: any = await Scheduler.findById(req.scheduler.id).select(
    `+password`
  );

  //2. CHECK IF POSTED CURRENT PASSWORD CORRECT
  if (
    !(await scheduler.correctPassword(
      req.body.passwordCurrent,
      scheduler.password
    ))
  ) {
    return next(new AppError(`The password entered is incorrect.`, 401));
  }

  //3. IF SO, UPDATE PASSWORD
  scheduler.password = req.body.password;
  scheduler.passwordConfirm = req.body.passwordConfirm;

  await scheduler.save();

  //4. LOG SCHEDULER IN AND SEND JWT
  createSendToken(scheduler, 200, req, res);
});

//PUBLIC USE----------------------------------------------------------

//DISPLAY IF LOGGED IN
export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //1. CHECK IF TOKEN EXISTS
  if (req.cookies.jwt) {
    try {
      //2. VERIFY TOKEN
      const decoded = await promisify<Function>(<any>jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      //3. CHECK IF SCHEDULER STILL EXISTS
      const currentScheduler = await Scheduler.findById(decoded.id);

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
    } catch (err) {
      return next();
    }
  }
  next();
};

//ALLOW DISPLAY OF SCHEDULER PROPERTIES
export const displayScheduler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //1. CHECK IF TOKEN EXISTS
    let token;

    if (
      req.headers.authorization &&
      (<string>req.headers.authorization).startsWith(`Bearer`)
    ) {
      token = (<string>req.headers.authorization).split(` `)[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else {
      return next();
    }

    if (!token) {
      return next(new AppError(`You are not logged in.`, 401));
    }

    //2. VERIFY TOKEN
    const decoded = await promisify<Function>(<any>jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    //3. CHECK IF SCHEDULER EXISTS
    const currentScheduler = await Scheduler.findById(decoded.id);

    if (!currentScheduler) {
      return next(new AppError(`This token is invalid.`, 401));
    }

    //4. CHECK IF SCHEDULER CHANGED PASSWORD AFTER JWT ISSUED
    if (currentScheduler.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          `Scheduler recently changed password. Please log in again.`,
          401
        )
      );
    }

    //5. GRANT ACCESS
    req.scheduler = currentScheduler;
    res.locals.scheduler = currentScheduler;
    next();
  } catch (err) {
    return next();
  }
};
