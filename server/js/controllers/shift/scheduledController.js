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
const scheduledModel_1 = __importDefault(require("../../models/shift/scheduledModel"));
const shiftModel_1 = __importDefault(require("../../models/shift/shiftModel"));
const factory = __importStar(require("../handlerFactory"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const appError_1 = __importDefault(require("../../utils/appError"));
//----------------------FOR SCHEDULER USE
//TOOLS----------------------------------------------------------
//ENSURE SHIFT DAY AND SCHEDULED DATE DAY MATCHES
exports.validateScheduled = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GRAB RAW SHIFT FROM ENTERED SHIFT ID
    const shift = yield shiftModel_1.default.findById(req.body.shiftId);
    //2. SETUP VARS FOR DAYS COMPARISON
    const day = shift.day;
    const date = new Date(req.body.date);
    const dateDay = date.getDay();
    //3. THROW ERROR IF DAYS DON'T MATCH
    if (day !== dateDay) {
        return next(new appError_1.default(`Shift day and scheduled date day do not match. Please enter a date that matches the shift day.`, 400));
    }
    //4. ALLOW IF MATCH
    next();
}));
//MAIN----------------------------------------------------------
//CREATE SCHEDULED SHIFT WITH EMPLOYEE FROM SHIFT ID AND EMPLOYEE ID (ENTERED)
exports.createScheduled = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const shift = req.body.shiftId;
    const employee = req.body.employeeId;
    const scheduler = req.scheduler.id;
    const date = req.body.date;
    const doc = yield scheduledModel_1.default.create({ shift, employee, scheduler, date });
    res.status(201).json({
        status: `success`,
        doc,
    });
}));
//GET ALL SCHEDULED SHIFTS OF EMPLOYEE FROM EMPLOYEE ID (ENTERED)
exports.getEmployeeSchedule = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. ADD SEARCH FUNCTIONALITY
    const features = new apiFeatures_1.default(scheduledModel_1.default.find({ employee: req.body.employeeId }), req.query)
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
//STANDARD----------------------------------------------------------
exports.getAllScheduled = factory.getAll(scheduledModel_1.default);
exports.getScheduled = factory.getOne(scheduledModel_1.default);
exports.deleteScheduled = factory.deleteOne(scheduledModel_1.default);
