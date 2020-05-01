import express from "express";

import * as preferredController from "../../controllers/shift/preferredController";

const router = express.Router();

//ROOT - /preferred

//GET ALL
router.route(`/`).get(preferredController.getAllPreferred);

//GET ONE AND DELETE ONE
router
  .route(`/:id`)
  .get(preferredController.getPreferred)
  .delete(preferredController.deletePreferred);

export = router;
