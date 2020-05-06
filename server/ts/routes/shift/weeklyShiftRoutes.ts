import express from "express";

import * as weeklyShiftController from "../../controllers/shift/weeklyShiftController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /weeklyShifts

//PUBLIC GETTERS
router.route(`/`).get(weeklyShiftController.getAllWeeklyShifts);
router.route(`/:id`).get(weeklyShiftController.getWeeklyShift);

//PROTECTED----------------------------------------------------------

//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
router.use(schedulerAuthController.protect);

//CREATE ONE
router
  .route(`/`)
  .post(
    weeklyShiftController.validateWeeklyShift,
    weeklyShiftController.createWeeklyShift
  );

//UPDATE ONE AND DELETE ONE
router
  .route(`/:id`)
  .patch(
    weeklyShiftController.setupUpdatedWeeklyShift,
    weeklyShiftController.validateWeeklyShift,
    weeklyShiftController.updateWeeklyShift
  )
  .delete(weeklyShiftController.deleteWeeklyShift);

export = router;
