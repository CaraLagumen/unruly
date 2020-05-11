import express from "express";

import * as shiftController from "../../controllers/shift/shiftController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /shifts

//PROTECTED----------------------------------------------------------

//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
//CREATE ONE
router.post(`/`, schedulerAuthController.protect, shiftController.createShift);

//UPDATE ONE AND DELETE ONE
router
  .route(`/:id`)
  .patch(schedulerAuthController.protect, shiftController.updateShift)
  .delete(schedulerAuthController.protect, shiftController.deleteShift);

//PUBLIC----------------------------------------------------------

//ACCESS BY /search?shiftStart=${input} OR /search?shiftEnd=${input}
router.get(`/search`, shiftController.getShiftsByHour);

//GETTERS
router.get(`/raw`, shiftController.getRawAllShifts);
router.get(`/`, shiftController.getAllShifts);
router.get(`/:id`, shiftController.getShift);

export = router;
