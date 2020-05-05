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
router.use(schedulerAuthController.protect);
//GET ALL AND CREATE ONE
router
    .route(`/`)
    .get(weeklyShiftController.getAllWeeklyShifts)
    .post(weeklyShiftController.validateWeeklyShiftDays, weeklyShiftController.createWeeklyShift);
//GET ONE, UPDATE ONE, AND DELETE ONE
router
    .route(`/:id`)
    .get(weeklyShiftController.getWeeklyShift)
    .patch(weeklyShiftController.insertUpdatedWeeklyShift, weeklyShiftController.validateWeeklyShiftDays, weeklyShiftController.updateWeeklyShift)
    .delete(weeklyShiftController.deleteWeeklyShift);
module.exports = router;
