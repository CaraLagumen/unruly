import express from "express";

import * as employeeController from "../../controllers/users/employeeController";
import * as employeeAuthController from "../../controllers/auth/employeeAuthController";
import * as schedulerAuthController from "../../controllers/auth/employeeAuthController";

const router = express.Router();

//ROOT - /employee

//PUBLIC----------------------------------------------------------

//AUTH IN AND OUT
router.post(`/register`, employeeAuthController.register);
router.post(`/login`, employeeAuthController.login);
router.get(`/logout`, employeeAuthController.logout);

//PASSWORD FORGOT AND RESET
router.post(`/forgotPassword`, employeeAuthController.forgotPassword);
router.patch(`/resetPassword/:token`, employeeAuthController.resetPassword);

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
router.use(schedulerAuthController.protect);

//GET ALL AND CREATE ONE
router
  .route(`/`)
  .get(employeeController.getAllEmployees)
  .post(employeeController.createEmployee);

//GET ONE, UPDATE ONE, AND DELETE ONE
router
  .route(`/:id`)
  .get(employeeController.getEmployee)
  .patch(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

export = router;
