import express from "express";

import * as scheduledController from "../../controllers/shift/scheduledController";

const router = express.Router();

//ROOT - /scheduled

//GET ALL
router.route(`/`).get(scheduledController.getAllScheduled);

//GET ONE AND DELETE ONE
router
  .route(`/:id`)
  .get(scheduledController.getScheduled)
  .delete(scheduledController.deleteScheduled);

export = router;
