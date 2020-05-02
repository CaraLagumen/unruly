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
const preferredController = __importStar(require("../../controllers/shift/preferredController"));
const employeeAuthController = __importStar(require("../../controllers/auth/employeeAuthController"));
const router = express_1.default.Router();
//ROOT - /preferred
//PROTECTED----------------------------------------------------------
//PROTECT ALL ROUTES FOR EMPLOYEE FROM HERE
router.use(employeeAuthController.protect);
//GET ALL
router.route(`/`).get(preferredController.getAllPreferred);
//GET ALL OF LOGGED IN EMPLOYEE
router.route(`/me`).get(preferredController.getAllMyPreferred);
//GET ONE, SAVE ONE, AND DELETE ONE
router
    .route(`/:id`)
    .get(preferredController.getPreferred)
    .post(preferredController.saveMyPreferred)
    .delete(preferredController.deletePreferred);
module.exports = router;
