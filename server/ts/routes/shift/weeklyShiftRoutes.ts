import express from "express";

import * as weeklyShiftController from "../../controllers/shift/weeklyShiftController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /weeklyShifts

//PROTECTED----------------------------------------------------------

//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
//CREATE ONE
router.post(
  `/`,
  schedulerAuthController.protect,
  weeklyShiftController.validateWeeklyShift,
  weeklyShiftController.createWeeklyShift
);

//UPDATE ONE AND DELETE ONE
router
  .route(`/:id`)
  .patch(
    schedulerAuthController.protect,
    weeklyShiftController.setupUpdatedWeeklyShift,
    weeklyShiftController.validateWeeklyShift,
    weeklyShiftController.updateWeeklyShift
  )
  .delete(
    schedulerAuthController.protect,
    weeklyShiftController.deleteWeeklyShiftConnections,
    weeklyShiftController.deleteWeeklyShift
  );

//PUBLIC----------------------------------------------------------

//GETTERS
router.get(`/`, weeklyShiftController.getAllWeeklyShifts);
router.get(`/:id`, weeklyShiftController.getWeeklyShift);

export = router;
