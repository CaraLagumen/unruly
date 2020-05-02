import express from "express";

import * as scheduledController from "../../controllers/shift/scheduledController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /scheduled

//PROTECTED----------------------------------------------------------
//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE

router.use(schedulerAuthController.protect);

//GET ALL
router.route(`/`).get(scheduledController.getAllScheduled);

//GET EMPLOYEE SCHEDULE
router
  .route(`/employeeSchedule/:id`)
  .get(scheduledController.getEmployeeSchedule);

//GET ONE AND DELETE ONE
router
  .route(`/:id`)
  .get(scheduledController.getScheduled)
  .post(scheduledController.createScheduled)
  .delete(scheduledController.deleteScheduled);

export = router;
