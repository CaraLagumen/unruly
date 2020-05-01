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
const router = express_1.default.Router();
//ROOT - /scheduled
//GET ALL
router.route(`/`).get(scheduledController.getAllScheduled);
//GET ONE AND DELETE ONE
router
    .route(`/:id`)
    .get(scheduledController.getScheduled)
    .delete(scheduledController.deleteScheduled);
module.exports = router;
