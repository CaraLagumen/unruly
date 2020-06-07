import express from "express";

import * as weeklyScheduledController from "../../controllers/shift/weeklyScheduledController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /weeklyScheduled

//PROTECTED----------------------------------------------------------

//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
//POPULATE ALL TO SCHEDULED
router.post(
  `/populate`,
  schedulerAuthController.protect,
  weeklyScheduledController.validatePopulate,
  weeklyScheduledController.populateAllToScheduled
);

//POPULATE TO SCHEDULED
router.post(
  `/populate/:id`,
  schedulerAuthController.protect,
  weeklyScheduledController.validatePopulate,
  weeklyScheduledController.populateToScheduled
);

//CREATE ONE
router.post(
  `/`,
  schedulerAuthController.protect,
  weeklyScheduledController.getScheduler,
  weeklyScheduledController.createWeeklyScheduled
);

//UPDATE ONE AND DELETE ONE
router
  .route(`/:id`)
  .patch(
    schedulerAuthController.protect,
    weeklyScheduledController.updateWeeklyScheduled
  )
  .delete(
    schedulerAuthController.protect,
    weeklyScheduledController.deleteWeeklyScheduled
  );

//PUBLIC----------------------------------------------------------

//GETTERS
router.get(`/`, weeklyScheduledController.getAllWeeklyScheduled);
router.get(`/:id`, weeklyScheduledController.getWeeklyScheduled);

export = router;
