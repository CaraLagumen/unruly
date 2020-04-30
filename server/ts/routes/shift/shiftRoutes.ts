import express from "express";

import * as shiftController from "../../controllers/shift/shiftController";

const router = express.Router();

//ROOT ROUTE - /shifts

//GET ALL AND CREATE ONE
router
  .route(`/`)
  .get(shiftController.getAllShifts)
  .post(shiftController.createShift);

//GET ONE, UPDATE ONE, AND DELETE ONE
router
  .route(`/:id`)
  .get(shiftController.getShift)
  .patch(shiftController.updateShift)
  .delete(shiftController.deleteShift);

export = router;
