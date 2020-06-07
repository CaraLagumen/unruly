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
const vacationController = __importStar(require("../../controllers/shift/vacationController"));
const employeeAuthController = __importStar(require("../../controllers/auth/employeeAuthController"));
const schedulerAuthController = __importStar(require("../../controllers/auth/schedulerAuthController"));
const router = express_1.default.Router();
//ROOT - /vacations
//PROTECTED----------------------------------------------------------
//ALLOW EMPLOYEE TO GET, CREATE WITH VALIDATION, AND DELETE WITH VALIDATION
router
    .route(`/me`)
    .get(employeeAuthController.protect, vacationController.getAllMyVacations)
    .post(employeeAuthController.protect, vacationController.validateVacationDate, vacationController.validateRequestedVacation, vacationController.requestVacation);
router.delete(`/me/:id`, employeeAuthController.protect, vacationController.validateVacationDate, vacationController.deleteMyVacation);
//PROTECT ALL ROUTES FOR SCHEDULER FROM HERE
router.use(schedulerAuthController.protect);
//GET RAW ALL
router.get(`/raw`, vacationController.getRawAllVacations);
//GET ALL AND CREATE ONE
router
    .route(`/`)
    .get(vacationController.getAllVacations)
    .post(vacationController.validateVacationDate, vacationController.createVacation);
//GET ONE, UPDATE ONE, AND DELETE ONE
router
    .route(`/:id`)
    .get(vacationController.getVacation)
    .patch(vacationController.validateVacationDate, vacationController.updateVacation)
    .delete(vacationController.validateVacationDate, vacationController.deleteVacation);
module.exports = router;
