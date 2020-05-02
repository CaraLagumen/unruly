import express from "express";

import * as schedulerController from "../../controllers/users/schedulerController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /scheduler

//PUBLIC----------------------------------------------------------

//AUTH IN AND OUT
router.post(`/register`, schedulerAuthController.register);
router.post(`/login`, schedulerAuthController.login);
router.get(`/logout`, schedulerAuthController.logout);

//PASSWORD FORGOT AND RESET
router.post(`/forgotPassword`, schedulerAuthController.forgotPassword);
router.patch(`/resetPassword/:token`, schedulerAuthController.resetPassword);

//PROTECTED----------------------------------------------------------
//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE

router.use(schedulerAuthController.protect);

router.get(`/me`, schedulerController.getMe, schedulerController.getScheduler);
router.patch(`/updateMe`, schedulerController.updateMe);
router.patch(`/updateMyPassword`, schedulerAuthController.updatePassword);

//GET ALL AND CREATE ONE
router
  .route(`/`)
  .get(schedulerController.getAllSchedulers)
  .post(schedulerController.createScheduler);

//GET ONE, UPDATE ONE, AND DELETE ONE
router
  .route(`/:id`)
  .get(schedulerController.getScheduler)
  .patch(schedulerController.updateScheduler)
  .delete(schedulerController.deleteScheduler);

export = router;
