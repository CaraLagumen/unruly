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
    weeklyShiftController.validateWeeklyShiftDays,
    weeklyShiftController.createWeeklyShift
  );

//GET ONE, UPDATE ONE, AND DELETE ONE
router
  .route(`/:id`)
  .get(weeklyShiftController.getWeeklyShift)
  .patch(
    weeklyShiftController.insertUpdatedWeeklyShift,
    weeklyShiftController.validateWeeklyShiftDays,
    weeklyShiftController.updateWeeklyShift
  )
  .delete(weeklyShiftController.deleteWeeklyShift);

export = router;
