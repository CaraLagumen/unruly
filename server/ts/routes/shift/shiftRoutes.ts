import express from "express";

import * as shiftController from "../../controllers/shift/shiftController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /shifts

//PUBLIC GETTERS
router.route(`/`).get(shiftController.getAllShifts);
router.route(`/:id`).get(shiftController.getShift);

//ACCESS BY /search?shiftStart=${input} OR /search?shiftEnd=${input}
router.route(`/search`).get(shiftController.getShiftsByHour);

//PROTECTED----------------------------------------------------------

//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
router.use(schedulerAuthController.protect);

//CREATE ONE
router.route(`/`).post(shiftController.createShift);

//UPDATE ONE AND DELETE ONE
router
  .route(`/:id`)
  .patch(shiftController.updateShift)
  .delete(shiftController.deleteShift);

export = router;
