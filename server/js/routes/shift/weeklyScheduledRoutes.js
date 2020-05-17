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
const weeklyScheduledController = __importStar(require("../../controllers/shift/weeklyScheduledController"));
const schedulerAuthController = __importStar(require("../../controllers/auth/schedulerAuthController"));
const router = express_1.default.Router();
//ROOT - /weeklyScheduled
//PROTECTED----------------------------------------------------------
//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
//POPULATE ALL TO SCHEDULED
router.post(`/populate`, schedulerAuthController.protect, weeklyScheduledController.populateAllToScheduled);
//POPULATE TO SCHEDULED
router.post(`/populate/:id`, schedulerAuthController.protect, weeklyScheduledController.populateToScheduled);
//CREATE ONE
router.post(`/`, schedulerAuthController.protect, weeklyScheduledController.getScheduler, weeklyScheduledController.createWeeklyScheduled);
//UPDATE ONE AND DELETE ONE
router
    .route(`/:id`)
    .patch(schedulerAuthController.protect, weeklyScheduledController.updateWeeklyScheduled)
    .delete(schedulerAuthController.protect, weeklyScheduledController.deleteWeeklyScheduled);
//PUBLIC----------------------------------------------------------
//GETTERS
router.get(`/`, weeklyScheduledController.getAllWeeklyScheduled);
router.get(`/:id`, weeklyScheduledController.getWeeklyScheduled);
module.exports = router;
