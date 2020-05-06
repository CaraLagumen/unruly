import express from "express";

import * as scheduledController from "../../controllers/shift/scheduledController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /scheduled

//PROTECTED----------------------------------------------------------

//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
router.use(schedulerAuthController.protect);

//GET ALL AND CREATE ONE
router
  .route(`/`)
  .get(scheduledController.getAllScheduled)
  .post(scheduledController.createScheduled);

//GET EMPLOYEE SCHEDULE
router.route(`/employee`).get(scheduledController.getEmployeeSchedule);

//GET ONE AND DELETE ONE
router
  .route(`/:id`)
  .get(scheduledController.getScheduled)
  .delete(scheduledController.deleteScheduled);

export = router;
