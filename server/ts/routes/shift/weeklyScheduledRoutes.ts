import express from "express";

import * as weeklyScheduledController from "../../controllers/shift/weeklyScheduledController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /weeklyScheduled

//PUBLIC GETTERS
router.route(`/`).get(weeklyScheduledController.getAllWeeklyScheduled);
router.route(`/:id`).get(weeklyScheduledController.getWeeklyScheduled);

//PROTECTED----------------------------------------------------------

//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
router.use(schedulerAuthController.protect);

//CREATE ONE
router.route(`/`).post(weeklyScheduledController.createWeeklyScheduled);

//POPULATE TO SCHEDULED
router.route(`/populate/:id`).post(weeklyScheduledController.populateToScheduled);

//UPDATE ONE AND DELETE ONE
router
  .route(`/:id`)
  .patch(weeklyScheduledController.updateWeeklyScheduled)
  .delete(weeklyScheduledController.deleteWeeklyScheduled);

export = router;
