import express from "express";

import * as employeeController from "../../controllers/users/employeeController";
import * as employeeAuthController from "../../controllers/auth/employeeAuthController";
import * as schedulerAuthController from "../../controllers/auth/employeeAuthController";

const router = express.Router();

//ROOT - /employee

//PROTECTED----------------------------------------------------------

//PROTECT ALL ROUTES FOR EMPLOYEE FROM HERE
router.get(
  `/me`,
  employeeAuthController.protect,
  employeeController.getMe,
  employeeController.getEmployee
);
router.patch(
  `/updateMe`,
  employeeAuthController.protect,
  employeeController.updateMe
);
router.patch(
  `/updateMyPassword`,
  employeeAuthController.protect,
  employeeAuthController.updatePassword
);

//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
//CREATE ONE
router.post(
  `/`,
  schedulerAuthController.protect,
  employeeController.createEmployee
);

//UPDATE ONE AND DELETE ONE
router
  .route(`/:id`)
  .patch(schedulerAuthController.protect, employeeController.updateEmployee)
  .delete(schedulerAuthController.protect, employeeController.deleteEmployee);

//PUBLIC----------------------------------------------------------

//GETTERS
router.get(`/`, employeeController.getAllEmployees);
router.get(`/:id`, employeeController.getEmployee);

//AUTH IN AND OUT
router.post(`/register`, employeeAuthController.register);
router.post(`/login`, employeeAuthController.login);
router.get(`/logout`, employeeAuthController.logout);

//PASSWORD FORGOT AND RESET
router.post(`/forgotPassword`, employeeAuthController.forgotPassword);
router.patch(`/resetPassword/:token`, employeeAuthController.resetPassword);

export = router;
