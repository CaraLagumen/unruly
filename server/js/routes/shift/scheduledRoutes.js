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
const scheduledController = __importStar(require("../../controllers/shift/scheduledController"));
const schedulerAuthController = __importStar(require("../../controllers/auth/schedulerAuthController"));
const router = express_1.default.Router();
//ROOT - /scheduled
//PUBLIC GETTERS
router.route(`/`).get(scheduledController.getAllScheduled);
router.route(`/:id`).get(scheduledController.getScheduled);
//GET EMPLOYEE SCHEDULE
router.route(`/employee/:id`).get(scheduledController.getEmployeeSchedule);
//PROTECTED----------------------------------------------------------
//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
router.use(schedulerAuthController.protect);
//CREATE ONE
router
    .route(`/`)
    .post(scheduledController.validateScheduled, scheduledController.createScheduled);
//DELETE ONE
router.route(`/:id`).delete(scheduledController.deleteScheduled);
module.exports = router;
