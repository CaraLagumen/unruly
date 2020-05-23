"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const employeeModel_1 = __importDefault(require("../../models/users/employeeModel"));
const vacationModel_1 = __importDefault(require("../../models/shift/vacationModel"));
const factory = __importStar(require("../handlerFactory"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const appError_1 = __importDefault(require("../../utils/appError"));
//----------------------FOR EMPLOYEE USE
//TOOLS----------------------------------------------------------
exports.validateVacation = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //----A. ENSURE REQUESTED VACATION DATE IS AHEAD OF NOW
    const date = moment_1.default(req.body.date);
    if (date < moment_1.default()) {
        return next(new appError_1.default(`Requested vacation date in the past. Please enter a date in the future.`, 400));
    }
    //----B. ENSURE EMPLOYEE VACATION DOES NOT EXCEED THEIR ALLOTTED VACATION
    //       PER YEAR BASED ON HIRE DATE [YEARS WORKED - VACATION DAYS]
    const employee = yield employeeModel_1.default.findById(req.employee.id);
    const myHireDate = moment_1.default(employee.hireDate);
    const myYearsWorked = moment_1.default().diff(myHireDate, "y");
    //1. FIND START OF YEAR TO COUNT VACATIONS FROM BASED ON HIRE DATE
    const yearNow = moment_1.default().year();
    const startOfMyYear = myHireDate.clone().year(yearNow);
    //2. SET START OF YEAR COUNT THIS YEAR IF HIRE MONTH AND DAY IS IN THE PAST
    //   OTHERWISE SUBTRACT A YEAR IF HIRE MONTH AND DAY IS IN THE FUTURE
    startOfMyYear < moment_1.default() ? startOfMyYear : startOfMyYear.subtract(1, "y");
    //3. GRAB ALL EMPLOYEE VACATIONS THEN FILTER OUT THE ONES THAT ARE
    //   FOR THIS YEAR BASED ON THE startOfMyYear
    const allMyVacations = yield vacationModel_1.default.find({ employee: req.employee.id });
    const allMyVacationsThisYear = allMyVacations.filter((vacation) => {
        return moment_1.default(vacation.date) > startOfMyYear;
    });
    //4. EMPLOYEE VACATION NUMBER DECIDED BY HIRE DATE
    //   [YEARS WORKED - VACATION DAYS]
    const myNumberOfVacationDays = () => {
        if (myYearsWorked >= 5) {
            return 19; //5 YEARS - 20 DAYS
        }
        else if (myYearsWorked >= 2) {
            return 9; //2 YEARS - 10 DAYS
        }
        else if (myYearsWorked >= 1) {
            return 4; //1 YEAR - 5 DAYS
        }
        else {
            return -1;
        }
    };
    //5. THROW ERROR IF NUMBER OF VACATION DAYS EXCEEDED
    if (allMyVacationsThisYear.length > myNumberOfVacationDays() ||
        myNumberOfVacationDays() === -1) {
        return next(new appError_1.default(`Number of vacation days ${myNumberOfVacationDays() + 1} exceeded. Unable to request vacation.`, 400));
    }
    //----C. ALLOW NEXT WHEN ALL VALIDATED
    next();
}));
//MAIN----------------------------------------------------------
//REQUEST VACATION FOR LOGGED IN EMPLOYEE FROM DATE (ENTERED)
exports.requestVacation = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = req.employee.id;
    const date = req.body.date; //DATE MUST BE IN YYYY-MM-DD
    const doc = yield vacationModel_1.default.create({ employee, date });
    res.status(201).json({
        status: `success`,
        doc,
    });
}));
//DELETE VACATION OF LOGGED IN EMPLOYEE FROM VACATION ID (PARAM)
exports.deleteMyVacation = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield vacationModel_1.default.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new appError_1.default(`No document found with that ID.`, 404));
    }
    res.status(204).json({
        status: `success`,
        doc: null,
    });
}));
//GET ALL VACATIONS OF LOGGED IN EMPLOYEE
exports.getAllMyVacations = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. ADD SEARCH FUNCTIONALITY
    const features = new apiFeatures_1.default(vacationModel_1.default.find({ employee: req.employee.id }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    //2. SET DATA DEPENDING ON QUERIES
    const doc = yield features.query;
    //3. SEND DATA
    res.status(200).json({
        status: `success`,
        results: doc.length,
        doc,
    });
}));
//----------------------FOR SCHEDULER USE
//STANDARD----------------------------------------------------------
exports.getRawAllVacations = factory.getRawAll(vacationModel_1.default);
exports.getAllVacations = factory.getAll(vacationModel_1.default);
exports.getVacation = factory.getOne(vacationModel_1.default);
exports.createVacation = factory.createOne(vacationModel_1.default);
exports.updateVacation = factory.updateOne(vacationModel_1.default);
exports.deleteVacation = factory.deleteOne(vacationModel_1.default);
