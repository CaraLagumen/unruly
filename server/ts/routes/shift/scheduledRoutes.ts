import express from "express";

import * as scheduledController from "../../controllers/shift/scheduledController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /scheduled

//PROTECTED----------------------------------------------------------

//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
//POPULATE STEADY EXTRA
router.post(
  `/populate`,
  schedulerAuthController.protect,
  scheduledController.populateSteadyExtra
);

//CREATE ONE
router.post(
  `/`,
  schedulerAuthController.protect,
  scheduledController.validateScheduled,
  scheduledController.createScheduled
);

//DELETE ONE
router.delete(
  `/:id`,
  schedulerAuthController.protect,
  scheduledController.deleteScheduled
);

//DELETE LAST SCHEDULED (CAN DELETE IN BULK)
router.delete(
  `/`,
  schedulerAuthController.protect,
  scheduledController.deleteLastScheduled
);

//PUBLIC----------------------------------------------------------

//GETTERS
router.get(`/raw`, scheduledController.getRawAllScheduled);
router.get(`/`, scheduledController.getAllScheduled);
router.get(`/:id`, scheduledController.getScheduled);
router.get(`/employee/:id`, scheduledController.getEmployeeSchedule);

export = router;
