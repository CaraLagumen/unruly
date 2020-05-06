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
const weeklyScheduledModel_1 = __importDefault(require("../../models/shift/weeklyScheduledModel"));
const weeklyShiftModel_1 = __importDefault(require("../../models/shift/weeklyShiftModel"));
const scheduledModel_1 = __importDefault(require("../../models/shift/scheduledModel"));
const shiftModel_1 = __importDefault(require("../../models/shift/shiftModel"));
const factory = __importStar(require("../handlerFactory"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
//----------------------FOR SCHEDULER USE
//CREATE INDIVIDUAL SCHEDULED FROM WEEKLY SCHEDULED ID (PARAM)
exports.populateToScheduled = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GRAB WHAT WE CAN FROM AVAILABLE
    const scheduler = req.scheduler.id;
    //2. GRAB RAW WEEKLY SCHEDULED FROM PARAM ID TO EXTRACT WEEKLY SHIFT THEN INDIVIDUAL SHIFTS
    const weeklyScheduled = yield weeklyScheduledModel_1.default.findById(req.params.id);
    const weeklyShift = yield weeklyShiftModel_1.default.findById(weeklyScheduled.weeklyShift);
    const shifts = [
        yield shiftModel_1.default.findById(weeklyShift.shiftDay1),
        yield shiftModel_1.default.findById(weeklyShift.shiftDay2),
        yield shiftModel_1.default.findById(weeklyShift.shiftDay3),
        yield shiftModel_1.default.findById(weeklyShift.shiftDay4),
        yield shiftModel_1.default.findById(weeklyShift.shiftDay5),
    ];
    //3. CREATE ARR WITH DATES TO LOOP INTO WHEN CREATING DOCS
    const dates = [];
    //EXTRACT DAYS FROM SHIFT (MON, TUES, ETC...)
    shifts.forEach((el) => {
        //SET VARS TO CREATE DATE BASED ON SHIFT DAYS
        const currentDay = new Date(Date.now()).getDay();
        const shiftDay = el.day;
        //TO DO: ENSURE ALL SHIFTS ARE STARTED ON THE NEXT MONDAY
        //MATCH SCHEDULED DATE DAY TO BE ASSIGNED TO SHIFT DAY
        //BY ADDING A WEEK (IN INDEX TERMS)
        //SUBTRACTING THE CURRENT DAY
        //AND DIVIDING BY A WEEK
        const setDay = (shiftDay + 6 - currentDay) % 7;
        //ADD A WEEK TO ENSURE SHIFTS ARE STARTED ON THE NEXT WEEK
        const setDate = new Date(Date.now()).setDate(setDay + 7);
        dates.push(new Date(setDate));
    });
    //4. CREATE ARR WITH SCHEDULED TO REPRESENT INDIVIDUAL DOCS
    const scheduled = [];
    for (let i = 0; i < shifts.length; i++) {
        //5. VALIDATE INDIVIDUAL SHIFTS BEFORE PUSH
        //   ENSURE SHIFT DAY AND SCHEDULED DATE DAY MATCHES
        if (shifts[i].day !== dates[i].getDay()) {
            return next(new appError_1.default(`Shift day and scheduled date day do not match. Please enter a date that matches the shift day.`, 400));
        }
        scheduled.push({
            //SCHEDULEDS MUST HAVE { shift, employee, scheduler, date }
            shift: shifts[i].id,
            employee: weeklyScheduled.employee,
            scheduler,
            date: dates[i],
        });
    }
    //6. CREATE DOC FROM INDIVIDUAL SCHEDULED
    const doc = yield scheduledModel_1.default.create(scheduled);
    res.status(201).json({
        status: `success`,
        doc,
    });
}));
exports.getAllWeeklyScheduled = factory.getAll(weeklyScheduledModel_1.default);
exports.getWeeklyScheduled = factory.getOne(weeklyScheduledModel_1.default);
exports.createWeeklyScheduled = factory.createOne(weeklyScheduledModel_1.default);
exports.updateWeeklyScheduled = factory.updateOne(weeklyScheduledModel_1.default);
exports.deleteWeeklyScheduled = factory.deleteOne(weeklyScheduledModel_1.default);
