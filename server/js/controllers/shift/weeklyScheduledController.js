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
const moment_timezone_1 = __importDefault(require("moment-timezone"));
moment_timezone_1.default.tz.setDefault(`UTC`);
const weeklyScheduledModel_1 = __importDefault(require("../../models/shift/weeklyScheduledModel"));
const weeklyShiftModel_1 = __importDefault(require("../../models/shift/weeklyShiftModel"));
const scheduledModel_1 = __importDefault(require("../../models/shift/scheduledModel"));
const factory = __importStar(require("../handlerFactory"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const times_1 = require("../../utils/times");
//----------------------FOR SCHEDULER USE
//TOOLS----------------------------------------------------------
//GET LOGGED IN SCHEDULER
exports.getScheduler = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.scheduler = req.scheduler.id;
    next();
}));
//ENSURE POPULATE IS ON A NEW WEEK
exports.validatePopulate = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GRAB ALL RAW SCHEDULED
    const scheduled = yield scheduledModel_1.default.find();
    //2. CREATE AN ARR OF DATES FROM ALL SCHEDULED AND GRAB THE LATEST SCHEDULED
    const scheduledDates = scheduled.map((scheduled) => moment_1.default(scheduled.createdAt));
    const latestScheduledDate = moment_1.default.max(scheduledDates);
    const lastScheduled = yield scheduledModel_1.default.findOne({
        createdAt: latestScheduledDate.toDate(),
    });
    //4. FIND IF LAST SCHEDULED HAS A STEADY EXTRA EMPLOYEE
    const lastScheduledEmployee = lastScheduled === null || lastScheduled === void 0 ? void 0 : lastScheduled.employee;
    //5. THROW ERROR IF FOUND A STEADY EXTRA WORKING IN THE SCHEDULING WEEK
    if (lastScheduledEmployee)
        if (lastScheduledEmployee.status === `on-call`)
            return next(new appError_1.default(`Found a steady extra working for the scheduling week. Full-time should be populated first. Cannot populate.`, 400));
    //3. FIND IF LAST SCHEDULED IS IN A WEEKLY SCHEDULED
    const weeklyShift = (yield weeklyShiftModel_1.default.findOne({
        $or: [
            { shiftDay1: lastScheduled === null || lastScheduled === void 0 ? void 0 : lastScheduled.shift },
            { shiftDay2: lastScheduled === null || lastScheduled === void 0 ? void 0 : lastScheduled.shift },
            { shiftDay3: lastScheduled === null || lastScheduled === void 0 ? void 0 : lastScheduled.shift },
            { shiftDay4: lastScheduled === null || lastScheduled === void 0 ? void 0 : lastScheduled.shift },
            { shiftDay5: lastScheduled === null || lastScheduled === void 0 ? void 0 : lastScheduled.shift },
        ],
    }));
    if (weeklyShift) {
        const weeklyScheduledRef = yield weeklyScheduledModel_1.default.findOne({ weeklyShift });
        //4. THROW ERR IF THERE IS ONE & THE DATE IS IN THE SCHEDULING WEEK
        if (weeklyScheduledRef && moment_1.default(lastScheduled === null || lastScheduled === void 0 ? void 0 : lastScheduled.date) > times_1.schedulingWeek) {
            return next(new appError_1.default(`Found a weekly scheduled filled for the scheduling week. Cannot populate.`, 400));
        }
    }
    next();
}));
//MAIN----------------------------------------------------------
//CREATE ALL INDIVIDUAL SCHEDULED FROM WEEKLY SCHEDULED IDS
exports.populateAllToScheduled = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    var _b, _c;
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
                weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay1,
                weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay2,
                weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay3,
                weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay4,
                weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay5,
            ];
            //3. CREATE ARR WITH DATES TO LOOP INTO WHEN CREATING DOC
            const dates = [];
            shifts.forEach((el) => {
                //EXTRACT DAYS FROM SHIFT (MON, TUES, ETC...)
                const shiftDay = el.day;
                //FROM THAT MONDAY, ADD SHIFT DAY TO MATCH
                const comingShiftDay = times_1.startSchedule
                    .clone()
                    .isoWeekday(shiftDay)
                    .toDate();
                dates.push(comingShiftDay);
            });
            //4. CREATE ARR WITH SCHEDULED TO REPRESENT INDIVIDUAL DOC
            const scheduled = [];
            for (let i = 0; i < shifts.length; i++) {
                //5. VALIDATE INDIVIDUAL SHIFTS BEFORE PUSH
                //   ENSURE SHIFT DAY AND SCHEDULED DATE DAY MATCHES
                if (((_b = shifts[i]) === null || _b === void 0 ? void 0 : _b.day) !== dates[i].getUTCDay()) {
                    return next(new appError_1.default(`Weekly shift is flawed. A shift day and scheduled date day did not match.`, 400));
                }
                scheduled.push({
                    //ALL SCHEDULED MUST HAVE { shift, employee, scheduler, date }
                    shift: (_c = shifts[i]) === null || _c === void 0 ? void 0 : _c.id,
                    employee: el === null || el === void 0 ? void 0 : el.employee.id,
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
//CREATE INDIVIDUAL SCHEDULED FROM WEEKLY SCHEDULED ID (PARAM) / POPULATE ONE FULL-TIME EMPLOYEE
exports.populateToScheduled = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    //1. GRAB WHAT WE CAN FROM AVAILABLE
    const scheduler = req.scheduler.id;
    //2. GRAB RAW WEEKLY SCHEDULED FROM PARAM ID TO EXTRACT WEEKLY SHIFT THEN INDIVIDUAL SHIFTS
    const weeklyScheduled = yield weeklyScheduledModel_1.default.findById(req.params.id);
    const weeklyShift = yield weeklyShiftModel_1.default.findById(weeklyScheduled === null || weeklyScheduled === void 0 ? void 0 : weeklyScheduled.weeklyShift);
    const shifts = [
        weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay1,
        weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay2,
        weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay3,
        weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay4,
        weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay5,
    ];
    //3. CREATE ARR WITH DATES TO LOOP INTO WHEN CREATING DOC
    const dates = [];
    shifts.forEach((el) => {
        //EXTRACT DAYS FROM SHIFT (MON, TUES, ETC...)
        const shiftDay = el.day;
        //FROM THAT MONDAY, ADD SHIFT DAY TO MATCH
        const comingShiftDay = times_1.startSchedule.clone().isoWeekday(shiftDay).toDate();
        dates.push(comingShiftDay);
    });
    //4. CREATE ARR WITH SCHEDULED TO REPRESENT INDIVIDUAL DOC
    const scheduled = [];
    //5. VALIDATE INDIVIDUAL SHIFTS BEFORE PUSH
    //   ENSURE SHIFT DAY AND SCHEDULED DATE DAY MATCHES
    for (let i = 0; i < shifts.length; i++) {
        if (((_d = shifts[i]) === null || _d === void 0 ? void 0 : _d.day) !== dates[i].getUTCDay()) {
            return next(new appError_1.default(`Weekly shift is flawed. A shift day and scheduled date day did not match.`, 400));
        }
        scheduled.push({
            //SCHEDULEDS MUST HAVE { shift, employee, scheduler, date }
            shift: (_e = shifts[i]) === null || _e === void 0 ? void 0 : _e.id,
            employee: weeklyScheduled === null || weeklyScheduled === void 0 ? void 0 : weeklyScheduled.employee.id,
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
