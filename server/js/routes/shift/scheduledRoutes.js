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
//CREATE ONE
router.post(`/`, schedulerAuthController.protect, scheduledController.validateScheduled, scheduledController.createScheduled);
//DELETE ONE
router.delete(`/:id`, schedulerAuthController.protect, scheduledController.deleteScheduled);
//DELETE LAST SCHEDULED (CAN DELETE IN BULK)
router.delete(`/`, schedulerAuthController.protect, scheduledController.deleteLastScheduled);
//PUBLIC----------------------------------------------------------
//GETTERS
router.get(`/raw`, scheduledController.getRawAllScheduled);
router.get(`/`, scheduledController.getAllScheduled);
router.get(`/:id`, scheduledController.getScheduled);
router.get(`/employee/:id`, scheduledController.getEmployeeSchedule);
module.exports = router;
