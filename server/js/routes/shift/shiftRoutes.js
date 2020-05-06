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
//PUBLIC GETTERS
router.route(`/`).get(shiftController.getAllShifts);
router.route(`/:id`).get(shiftController.getShift);
//ACCESS BY /search?shiftStart=${input} OR /search?shiftEnd=${input}
router.route(`/search`).get(shiftController.getShiftsByHour);
//PROTECTED----------------------------------------------------------
//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
router.use(schedulerAuthController.protect);
//CREATE ONE
router.route(`/`).post(shiftController.createShift);
//UPDATE ONE AND DELETE ONE
router
    .route(`/:id`)
    .patch(shiftController.updateShift)
    .delete(shiftController.deleteShift);
module.exports = router;
