import express from "express";

import * as vacationController from "../../controllers/shift/vacationController";
import * as employeeAuthController from "../../controllers/auth/employeeAuthController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /vacations

//PROTECTED----------------------------------------------------------

//ALLOW EMPLOYEE TO GET, CREATE WITH VALIDATION, AND DELETE WITH VALIDATION
router
  .route(`/me`)
  .get(employeeAuthController.protect, vacationController.getAllMyVacations)
  .post(employeeAuthController.protect, vacationController.requestVacation);
router.delete(
  `/me/:id`,
  employeeAuthController.protect,
  vacationController.deleteMyVacation
);

//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
router.use(schedulerAuthController.protect);

//GET ALL AND CREATE ONE
router
  .route(`/`)
  .get(vacationController.getAllVacations)
  .post(vacationController.createVacation);

//GET ONE, UPDATE ONE, AND DELETE ONE
router
  .route(`/:id`)
  .get(vacationController.getVacation)
  .patch(vacationController.updateVacation)
  .delete(vacationController.deleteVacation);

export = router;
