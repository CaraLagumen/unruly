import { RequestHandler } from "express";

import Employee from "../../models/users/employeeModel";
import * as factory from "../handlerFactory";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";

//TOOLS----------------------------------------------------------

//FILTERED FIELDS FOR updateMe
const filterObj = (obj: { [key: string]: any }, ...allowedFields: string[]) => {
  const newObj: { [key: string]: any } = {};

  Object.keys(obj).forEach((el: string) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

//MAIN----------------------------------------------------------

//GET LOGGED IN EMPLOYEE
export const getMe: RequestHandler = (req, res, next) => {
  req.params.id = req.employee.id;
  next();
};

//UPDATE LOGGED IN EMPLOYEE
export const updateMe = catchAsync(async (req, res, next) => {
  //1. CREATE ERROR IF EMPLOYEE POSTS PASSWORD DATA
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        `This route is not for password updates. Use /updateMyPassword.`,
        400
      )
    );
  }

  //2. FILTER FIELD NAMES THAT ARE ALLOWED TO BE UPDATED
  const filteredBody = filterObj(req.body, `email`, `preferredShiftSlots`);

  //3. UPDATE EMPLOYEE DOC
  const updatedEmployee = await Employee.findByIdAndUpdate(
    req.employee.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  //4. SEND UPDATED EMPLOYEE
  res.status(200).json({
    status: `success`,
    user: updatedEmployee,
  });
});

//STANDARD----------------------------------------------------------

export const getAllEmployees = factory.getAll(Employee);
export const getEmployee = factory.getOne(Employee);
export const createEmployee = factory.createOne(Employee);
export const updateEmployee = factory.updateOne(Employee);
export const deleteEmployee = factory.deleteOne(Employee);
