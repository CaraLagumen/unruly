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
//PUBLIC GETTERS
router.route(`/`).get(weeklyScheduledController.getAllWeeklyScheduled);
router.route(`/:id`).get(weeklyScheduledController.getWeeklyScheduled);
//PROTECTED----------------------------------------------------------
//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
router.use(schedulerAuthController.protect);
//CREATE ONE
router.route(`/`).post(weeklyScheduledController.createWeeklyScheduled);
//POPULATE TO SCHEDULED
router.route(`/populate/:id`).post(weeklyScheduledController.populateToScheduled);
//UPDATE ONE AND DELETE ONE
router
    .route(`/:id`)
    .patch(weeklyScheduledController.updateWeeklyScheduled)
    .delete(weeklyScheduledController.deleteWeeklyScheduled);
module.exports = router;
