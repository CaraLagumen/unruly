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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
const weeklyScheduledModel_1 = __importDefault(require("../../models/shift/weeklyScheduledModel"));
const weeklyShiftModel_1 = __importDefault(require("../../models/shift/weeklyShiftModel"));
const scheduledModel_1 = __importDefault(require("../../models/shift/scheduledModel"));
const shiftModel_1 = __importDefault(require("../../models/shift/shiftModel"));
const factory = __importStar(require("../handlerFactory"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
//----------------------FOR SCHEDULER USE
//TOOLS----------------------------------------------------------
//GET LOGGED IN SCHEDULER
exports.getScheduler = catchAsync_1.default((req, res, next) => {
    req.body.scheduler = req.scheduler.id;
    next();
});
//MAIN----------------------------------------------------------
//CREATE ALL INDIVIDUAL SCHEDULED FROM WEEKLY SCHEDULED IDS
exports.populateAllToScheduled = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    //1. GRAB WHAT WE CAN FROM AVAILABLE
    const allWeeklyScheduled = yield weeklyScheduledModel_1.default.find();
    const scheduler = req.scheduler.id;
    const allScheduled = [];
    try {
        for (var allWeeklyScheduled_1 = __asyncValues(allWeeklyScheduled), allWeeklyScheduled_1_1; allWeeklyScheduled_1_1 = yield allWeeklyScheduled_1.next(), !allWeeklyScheduled_1_1.done;) {
            let el = allWeeklyScheduled_1_1.value;
            //2. GRAB RAW WEEKLY SCHEDULED FROM PARAM ID TO EXTRACT
            //   WEEKLY SHIFT THEN INDIVIDUAL SHIFTS
            const weeklyShift = yield weeklyShiftModel_1.default.findById(el.weeklyShift);
            const shifts = [
                yield shiftModel_1.default.findById(weeklyShift.shiftDay1),
                yield shiftModel_1.default.findById(weeklyShift.shiftDay2),
                yield shiftModel_1.default.findById(weeklyShift.shiftDay3),
                yield shiftModel_1.default.findById(weeklyShift.shiftDay4),
                yield shiftModel_1.default.findById(weeklyShift.shiftDay5),
            ];
            //3. CREATE ARR WITH DATES TO LOOP INTO WHEN CREATING DOC
            const dates = [];
            shifts.forEach((el) => {
                //EXTRACT DAYS FROM SHIFT (MON, TUES, ETC...)
                const shiftDay = el.day;
                const comingMonday = moment_1.default().add(1, "w").isoWeekday(1);
                //FROM THAT MONDAY, ADD SHIFT DAY TO MATCH
                const comingShiftDay = comingMonday.isoWeekday(shiftDay).toDate();
                dates.push(comingShiftDay);
            });
            //4. CREATE ARR WITH SCHEDULED TO REPRESENT INDIVIDUAL DOC
            const scheduled = [];
            for (let i = 0; i < shifts.length; i++) {
                //5. VALIDATE INDIVIDUAL SHIFTS BEFORE PUSH
                //   ENSURE SHIFT DAY AND SCHEDULED DATE DAY MATCHES
                if (shifts[i].day !== dates[i].getDay()) {
                    return next(new appError_1.default(`Weekly shift is flawed. A shift day and scheduled date day did not match.`, 400));
                }
                scheduled.push({
                    //ALL SCHEDULED MUST HAVE { shift, employee, scheduler, date }
                    shift: shifts[i].id,
                    employee: el.employee.id,
                    scheduler,
                    date: dates[i],
                });
            }
            allScheduled.push(scheduled);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (allWeeklyScheduled_1_1 && !allWeeklyScheduled_1_1.done && (_a = allWeeklyScheduled_1.return)) yield _a.call(allWeeklyScheduled_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    //6. CREATE DOC FROM INDIVIDUAL ALL SCHEDULED
    const doc = yield scheduledModel_1.default.insertMany([].concat(...allScheduled));
    res.status(201).json({
        status: `success`,
        results: allScheduled.length,
        doc,
    });
}));
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
    //3. CREATE ARR WITH DATES TO LOOP INTO WHEN CREATING DOC
    const dates = [];
    shifts.forEach((el) => {
        //EXTRACT DAYS FROM SHIFT (MON, TUES, ETC...)
        const shiftDay = el.day;
        const comingMonday = moment_1.default().add(2, "w").isoWeekday(1);
        //FROM THAT MONDAY, ADD SHIFT DAY TO MATCH
        const comingShiftDay = comingMonday.isoWeekday(shiftDay);
        dates.push(comingShiftDay.toDate());
    });
    //4. CREATE ARR WITH SCHEDULED TO REPRESENT INDIVIDUAL DOC
    const scheduled = [];
    //5. VALIDATE INDIVIDUAL SHIFTS BEFORE PUSH
    //   ENSURE SHIFT DAY AND SCHEDULED DATE DAY MATCHES
    for (let i = 0; i < shifts.length; i++) {
        if (shifts[i].day !== dates[i].getDay()) {
            return next(new appError_1.default(`Weekly shift is flawed. A shift day and scheduled date day did not match.`, 400));
        }
        scheduled.push({
            //SCHEDULEDS MUST HAVE { shift, employee, scheduler, date }
            shift: shifts[i].id,
            employee: weeklyScheduled.employee.id,
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
//STANDARD----------------------------------------------------------
exports.getAllWeeklyScheduled = factory.getAll(weeklyScheduledModel_1.default);
exports.getWeeklyScheduled = factory.getOne(weeklyScheduledModel_1.default);
exports.createWeeklyScheduled = factory.createOne(weeklyScheduledModel_1.default);
exports.updateWeeklyScheduled = factory.updateOne(weeklyScheduledModel_1.default);
exports.deleteWeeklyScheduled = factory.deleteOne(weeklyScheduledModel_1.default);
