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
const employeeController = __importStar(require("../../controllers/users/employeeController"));
const employeeAuthController = __importStar(require("../../controllers/auth/employeeAuthController"));
const router = express_1.default.Router();
//ROOT - /employee
//PUBLIC----------------------------------------------------------
//AUTH IN AND OUT
router.post(`/register`, employeeAuthController.register);
router.post(`/login`, employeeAuthController.login);
router.get(`/logout`, employeeAuthController.logout);
//PASSWORD FORGOT AND RESET
router.post(`/forgotPassword`, employeeAuthController.forgotPassword);
router.patch(`/resetPassword/:token`, employeeAuthController.resetPassword);
//PROTECTED----------------------------------------------------------
//PROTECT ALL ROUTES FOR EMPLOYEE FROM HERE
router.use(employeeAuthController.protect);
router.get(`/me`, employeeController.getMe, employeeController.getEmployee);
router.patch(`/updateMe`, employeeController.updateMe);
router.patch(`/updateMyPassword`, employeeAuthController.updatePassword);
//GET ALL AND CREATE ONE
router
    .route(`/`)
    .get(employeeController.getAllEmployees)
    .post(employeeController.createEmployee);
//GET ONE, UPDATE ONE, AND DELETE ONE
router
    .route(`/:id`)
    .get(employeeController.getEmployee)
    .patch(employeeController.updateEmployee)
    .delete(employeeController.deleteEmployee);
module.exports = router;
