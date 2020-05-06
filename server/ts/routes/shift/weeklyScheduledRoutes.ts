import express from "express";

import * as weeklyScheduledController from "../../controllers/shift/weeklyScheduledController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /weeklyScheduled

//PROTECTED----------------------------------------------------------

//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
router.use(schedulerAuthController.protect);

//GET ALL AND CREATE ONE
router
  .route(`/`)
  .get(weeklyScheduledController.getAllWeeklyScheduleds)
  .post(weeklyScheduledController.createWeeklyScheduled);

//GET ONE, UPDATE ONE, AND DELETE ONE
router
  .route(`/:id`)
  .get(weeklyScheduledController.getWeeklyScheduled)
  .patch(weeklyScheduledController.updateWeeklyScheduled)
  .delete(weeklyScheduledController.deleteWeeklyScheduled);

export = router;
