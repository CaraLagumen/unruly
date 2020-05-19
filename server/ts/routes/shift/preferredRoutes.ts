import express from "express";

import * as preferredController from "../../controllers/shift/preferredController";
import * as employeeAuthController from "../../controllers/auth/employeeAuthController";

const router = express.Router();

//ROOT - /preferred

//PROTECTED----------------------------------------------------------

//PROTECT ALL ROUTES FOR EMPLOYEE FROM HERE
router.use(employeeAuthController.protect);

//GET ALL
router.get(`/`, preferredController.getAllPreferred);

//GET ALL AND SAVE ONE OF LOGGED IN EMPLOYEE
router
  .route(`/me`)
  .get(preferredController.getAllMyPreferred)
  .post(
    preferredController.validatePreferred,
    preferredController.saveMyPreferred
  );

//UPDATE ONE AND DELETE ONE OF LOGGED IN EMPLOYEE
router
  .route(`/:id`)
  .patch(
    preferredController.validatePreferred,
    preferredController.updateMyPreferred
  )
  .delete(preferredController.deleteMyPreferred);

//DATABASE ONLY----------------------------------------------------------

//GET ONE AND DELETE ONE
// router
//   .route(`/:id`)
//   .get(preferredController.getPreferred)
//   .delete(preferredController.deletePreferred);

export = router;
