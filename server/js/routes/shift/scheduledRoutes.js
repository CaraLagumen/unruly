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
//PROTECTED----------------------------------------------------------
//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
router.use(schedulerAuthController.protect);
//GET ALL
router.route(`/`).get(scheduledController.getAllScheduled);
//GET EMPLOYEE SCHEDULE
router
    .route(`/employeeSchedule/:id`)
    .get(scheduledController.getEmployeeSchedule);
//GET ONE AND DELETE ONE
router
    .route(`/:id`)
    .get(scheduledController.getScheduled)
    .post(scheduledController.createScheduled)
    .delete(scheduledController.deleteScheduled);
module.exports = router;
