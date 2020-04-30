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
const router = express_1.default.Router();
//ROOT ROUTE - /shifts
//GET ALL AND CREATE ONE
router
    .route(`/`)
    .get(shiftController.getAllShifts)
    .post(shiftController.createShift);
//GET ONE, UPDATE ONE, AND DELETE ONE
router
    .route(`/:id`)
    .get(shiftController.getShift)
    .patch(shiftController.updateShift)
    .delete(shiftController.deleteShift);
module.exports = router;