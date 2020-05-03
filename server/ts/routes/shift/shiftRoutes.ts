import express from "express";

import * as shiftController from "../../controllers/shift/shiftController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /shifts
//PROTECTED----------------------------------------------------------
//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE

router.use(schedulerAuthController.protect);

//GET ALL AND CREATE ONE
router
  .route(`/`)
  .get(shiftController.getAllShifts)
  .post(shiftController.createShift);

//GET ONE, UPDATE ONE, AND DELETE ONE
router
  .route(`/:id`)
  .get(shiftController.getShift)
  .patch(shiftController.updateShift)
  .delete(shiftController.deleteShift);

export = router;
