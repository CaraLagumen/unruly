import express from "express";

import * as preferredController from "../../controllers/shift/preferredController";
import * as employeeAuthController from "../../controllers/auth/employeeAuthController";

const router = express.Router();

//ROOT - /preferred

//PROTECTED----------------------------------------------------------
//PROTECT ALL ROUTES FOR EMPLOYEE FROM HERE

router.use(employeeAuthController.protect);

//GET ALL
router.route(`/`).get(preferredController.getAllPreferred);

//GET ALL OF LOGGED IN EMPLOYEE
router
  .route(`/me`)
  .get(preferredController.getAllMyPreferred)
  .delete(preferredController.deleteMyPreferred);
  
//SAVE ONE AND DELETE ONE OF LOGGED IN EMPLOYEE
router.route(`/me/:id`).post(preferredController.saveMyPreferred);

//GET ONE AND DELETE ONE
router
  .route(`/:id`)
  .get(preferredController.getPreferred)
  .delete(preferredController.deletePreferred);

export = router;
