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
    const today = moment_1.default();
    const day = shift.day;
    const date = req.body.date;
    const dateDay = moment_1.default(date, "YYYY-MM-DD").weekday();
    //3. THROW ERROR IF DATE IS IN THE PAST
    if (moment_1.default(date) <= today) {
        return next(new appError_1.default(`Scheduled date is in the past. Please enter a date in the future.`, 400));
    }
    if (day !== dateDay) {
        //4. THROW ERROR IF DAYS DON'T MATCH
        return next(new appError_1.default(`Shift day and scheduled date day do not match. Please enter a date that matches the shift day.`, 400));
    }
    //5. ALLOW WHEN ALL VALIDATED
    next();
}));
//MAIN----------------------------------------------------------
//GET ALL SCHEDULED SHIFTS OF EMPLOYEE FROM EMPLOYEE ID (ENTERED)
exports.getEmployeeSchedule = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. ADD SEARCH FUNCTIONALITY
    const features = new apiFeatures_1.default(
    //@ts-ignore
    scheduledModel_1.default.find({ employee: req.params.id }), req.query)
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
//CREATE SCHEDULED SHIFT WITH EMPLOYEE FROM SHIFT ID AND EMPLOYEE ID (ENTERED)
exports.createScheduled = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const shift = req.body.shiftId;
    const employee = req.body.employeeId;
    const scheduler = req.scheduler.id;
    const date = req.body.date; //DATE MUST BE IN YYYY-MM-DD ORDER TO VALIDATE
    const doc = yield scheduledModel_1.default.create({ shift, employee, scheduler, date });
    res.status(201).json({
        status: `success`,
        doc,
    });
}));
//DELETE LAST SCHEDULED BY FINDING CREATED BY (CAN DELETE IN BULK)
exports.deleteLastScheduled = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GRAB ALL RAW SCHEDULED
    const scheduled = yield scheduledModel_1.default.find();
    //2. CREATE AN ARR OF DATES FROM ALL SCHEDULED AND GRAB THE LATEST SCHEDULED
    const scheduledDates = scheduled.map((scheduled) => moment_1.default(scheduled.createdAt));
    const latestScheduledDate = moment_1.default.max(scheduledDates);
    const lastScheduled = yield scheduledModel_1.default.findOne({
        createdAt: latestScheduledDate.toDate(),
    });
    //3. DON'T DELETE IF LATEST DATE IN THE PAST
    if (moment_1.default(lastScheduled === null || lastScheduled === void 0 ? void 0 : lastScheduled.date) < moment_1.default()) {
        return next(new appError_1.default(`Last scheduled is in the past. Cannot delete.`, 404));
    }
    //4. DELETE ALL SCHEDULED WITH THE SAME LATEST DATE
    const doc = yield scheduledModel_1.default.deleteMany({
        createdAt: latestScheduledDate.toDate(),
    });
    if (!doc) {
        return next(new appError_1.default(`No documents found.`, 404));
    }
    //5. SEND DATA
    res.status(204).json({
        status: `success`,
        doc: null,
    });
}));
//STANDARD----------------------------------------------------------
exports.getRawAllScheduled = factory.getRawAll(scheduledModel_1.default);
exports.getAllScheduled = factory.getAll(scheduledModel_1.default);
exports.getScheduled = factory.getOne(scheduledModel_1.default);
exports.deleteScheduled = factory.deleteOne(scheduledModel_1.default);
