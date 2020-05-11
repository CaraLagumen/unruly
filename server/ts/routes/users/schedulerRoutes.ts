import express from "express";

import * as schedulerController from "../../controllers/users/schedulerController";
import * as schedulerAuthController from "../../controllers/auth/schedulerAuthController";

const router = express.Router();

//ROOT - /scheduler

//PROTECTED----------------------------------------------------------

//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
router.get(
  `/me`,
  schedulerAuthController.protect,
  schedulerController.getMe,
  schedulerController.getScheduler
);
router.patch(
  `/updateMe`,
  schedulerAuthController.protect,
  schedulerController.updateMe
);
router.patch(
  `/updateMyPassword`,
  schedulerAuthController.protect,
  schedulerAuthController.updatePassword
);

//CREATE ONE
router.post(
  `/`,
  schedulerAuthController.protect,
  schedulerController.createScheduler
);

//UPDATE ONE AND DELETE ONE
router
  .route(`/:id`)
  .patch(schedulerAuthController.protect, schedulerController.updateScheduler)
  .delete(schedulerAuthController.protect, schedulerController.deleteScheduler);

//PUBLIC----------------------------------------------------------

//GETTERS
router.get(`/`, schedulerController.getAllSchedulers);
router.get(`/:id`, schedulerController.getScheduler);

//AUTH IN AND OUT
router.post(`/register`, schedulerAuthController.register);
router.post(`/login`, schedulerAuthController.login);
router.get(`/logout`, schedulerAuthController.logout);

//PASSWORD FORGOT AND RESET
router.post(`/forgotPassword`, schedulerAuthController.forgotPassword);
router.patch(`/resetPassword/:token`, schedulerAuthController.resetPassword);

export = router;
