import express from "express";

import * as weeklyShiftController from "../../controllers/shift/weeklyShiftController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /weeklyShifts

//PROTECTED----------------------------------------------------------

//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
router.use(schedulerAuthController.protect);

//GET ALL AND CREATE ONE
router
  .route(`/`)
  .get(weeklyShiftController.getAllWeeklyShifts)
  .post(
    weeklyShiftController.validateWeeklyShift,
    weeklyShiftController.createWeeklyShift
  );

//GET ONE, UPDATE ONE, AND DELETE ONE
router
  .route(`/:id`)
  .get(weeklyShiftController.getWeeklyShift)
  .patch(
    weeklyShiftController.setupUpdatedWeeklyShift,
    weeklyShiftController.validateWeeklyShift,
    weeklyShiftController.updateWeeklyShift
  )
  .delete(weeklyShiftController.deleteWeeklyShift);

export = router;
