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
const shiftController = __importStar(require("../../controllers/shift/shiftController"));
const schedulerAuthController = __importStar(require("../../controllers/auth/schedulerAuthController"));
const router = express_1.default.Router();
//ROOT - /shifts
//PROTECTED----------------------------------------------------------
//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
//CREATE ONE
router.post(`/`, schedulerAuthController.protect, shiftController.createShift);
//UPDATE ONE AND DELETE ONE
router
    .route(`/:id`)
    .patch(schedulerAuthController.protect, shiftController.updateShift)
    .delete(schedulerAuthController.protect, shiftController.deleteShiftConnections, shiftController.deleteShift);
//PUBLIC----------------------------------------------------------
//ACCESS BY /search?shiftStart=${input} OR /search?shiftEnd=${input}
router.get(`/search`, shiftController.getShiftsByHour);
//GETTERS
router.get(`/raw`, shiftController.getRawAllShifts);
router.get(`/`, shiftController.getAllShifts);
router.get(`/:id`, shiftController.getShift);
module.exports = router;
