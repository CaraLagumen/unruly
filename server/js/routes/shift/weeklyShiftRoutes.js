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
const weeklyShiftController = __importStar(require("../../controllers/shift/weeklyShiftController"));
const schedulerAuthController = __importStar(require("../../controllers/auth/schedulerAuthController"));
const router = express_1.default.Router();
//ROOT - /weeklyShifts
//PROTECTED----------------------------------------------------------
//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
//CREATE ONE
router.post(`/`, schedulerAuthController.protect, weeklyShiftController.validateWeeklyShift, weeklyShiftController.createWeeklyShift);
//UPDATE ONE AND DELETE ONE
router
    .route(`/:id`)
    .patch(schedulerAuthController.protect, weeklyShiftController.setupUpdatedWeeklyShift, weeklyShiftController.validateWeeklyShift, weeklyShiftController.updateWeeklyShift)
    .delete(schedulerAuthController.protect, weeklyShiftController.deleteWeeklyShiftConnections, weeklyShiftController.deleteWeeklyShift);
//PUBLIC----------------------------------------------------------
//GETTERS
router.get(`/`, weeklyShiftController.getAllWeeklyShifts);
router.get(`/:id`, weeklyShiftController.getWeeklyShift);
module.exports = router;
