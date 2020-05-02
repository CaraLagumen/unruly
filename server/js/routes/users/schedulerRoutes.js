"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
const express_1 = __importDefault(require("express"));
const schedulerController = __importStar(require("../../controllers/users/schedulerController"));
const schedulerAuthController = __importStar(require("../../controllers/auth/schedulerAuthController"));
const router = express_1.default.Router();
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
module.exports = router;
