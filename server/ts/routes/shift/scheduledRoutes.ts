import express from "express";

import * as scheduledController from "../../controllers/shift/scheduledController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /scheduled

//PUBLIC GETTERS
router.route(`/`).get(scheduledController.getAllScheduled);
router.route(`/:id`).get(scheduledController.getScheduled);

//PROTECTED----------------------------------------------------------

//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
router.use(schedulerAuthController.protect);

//CREATE ONE
router
  .route(`/`)
  .post(
    scheduledController.validateScheduled,
    scheduledController.createScheduled
  );

//GET EMPLOYEE SCHEDULE
router.route(`/employee`).get(scheduledController.getEmployeeSchedule);

//DELETE ONE
router.route(`/:id`).delete(scheduledController.deleteScheduled);

export = router;
