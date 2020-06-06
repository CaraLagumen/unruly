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
const scheduledModel_1 = __importDefault(require("../../models/shift/scheduledModel"));
const shiftModel_1 = __importDefault(require("../../models/shift/shiftModel"));
const vacationModel_1 = __importDefault(require("../../models/shift/vacationModel"));
const factory = __importStar(require("../handlerFactory"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const appError_1 = __importDefault(require("../../utils/appError"));
//----------------------FOR SCHEDULER USE
//TOOLS----------------------------------------------------------
//ENSURE SHIFT DAY AND SCHEDULED DATE DAY MATCHES
exports.validateScheduled = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GRAB RAW SHIFT FROM ENTERED SHIFT ID
    const shift = yield shiftModel_1.default.findById(req.body.shift);
    //2. SETUP VARS FOR DAYS COMPARISON
    const today = moment_1.default();
    const day = shift.day;
    const date = req.body.date;
    const dateDay = moment_1.default(date, "YYYY-MM-DD").weekday();
    //3. ERROR IF DATE IS IN THE PAST
    if (moment_1.default(date) <= today) {
        return next(new appError_1.default(`Scheduled date is in the past. Please enter a date in the future.`, 400));
    }
    //4. ERROR IF DAYS DON'T MATCH
    if (day !== dateDay) {
        return next(new appError_1.default(`Shift day and scheduled date day do not match. Please enter a date that matches the shift day.`, 400));
    }
    //5. ERROR IF EMPLOYEE ON VACATION
    const employeeVacations = yield vacationModel_1.default.find({
        employee: req.body.employee,
    });
    const matchingDate = employeeVacations.find((vacation) => moment_1.default(vacation.date).format("LL") === moment_1.default(date).format("LL"));
    if (matchingDate) {
        if (matchingDate.approved === true) {
            return next(new appError_1.default(`Employee has an approved vacation day for this day. Please set another employee for this shift.`, 400));
        }
    }
    //6. ALLOW WHEN ALL VALIDATED
    next();
}));
//DON'T DELETE IF DATE IN THE PAST
exports.validateDelete = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const scheduled = yield scheduledModel_1.default.findById(req.params.id);
    if (moment_1.default(scheduled === null || scheduled === void 0 ? void 0 : scheduled.date) < moment_1.default()) {
        return next(new appError_1.default(`Scheduled date is in the past. Cannot delete.`, 400));
    }
    console.log(scheduled);
    next();
}));
//MAIN----------------------------------------------------------
//CREATE A BUNCH OF WEEKLY SHIFT REFS FOR ON-CALL EMPLOYEES
exports.populateSteadyExtra = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const blankShifts = yield shiftModel_1.default.find();
    const allTheScheduledEver = yield scheduledModel_1.default.find();
    const scheduler = req.scheduler.id;
    const weekAhead = 2; //WEEK TO SCHEDULE
    //----A. SET UP VARS FOR WEEKLY SHIFT REF
    //1. FIND FULL-TIME SCHEDULED BY FILTERING THOSE AFTER THE SCHEDULED SUNDAY
    const comingSunday = moment_1.default().add(weekAhead, "w").startOf("w");
    const scheduledWeek = [...allTheScheduledEver].filter((scheduled) => moment_1.default(scheduled.date) >= comingSunday);
    //2. FIND SHIFTS TO FILL BY FILTERING THE ALREADY SCHEDULED ONES FROM ALL SHIFTS
    const scheduledShifts = scheduledWeek.map((scheduled) => scheduled.shift.id);
    const shiftsToFill = [...blankShifts].filter((shift) => !scheduledShifts.includes(shift.id));
    shiftsToFill.sort((x, y) => x.shiftStart[0] - y.shiftStart[0]);
    if (!shiftsToFill.length) {
        return next(new appError_1.default(`All shifts have already been filled for coming week. Cannot populate.`, 400));
    }
    //3. CREATE A BUNCH OF SHIFTS ARRS, ONE FOR EACH DAY (MON[], TUE[], WED[], ETC.)
    const sortedShiftsToFill = [[], [], [], [], [], [], []];
    shiftsToFill.forEach((shift) => {
        sortedShiftsToFill[shift.day].push(shift);
    });
    //4. PREPARE ARR TO START WITH THE DAY WITH MOST SHIFTS
    sortedShiftsToFill.sort((x, y) => y.length - x.length);
    //----B. CREATE SCHEDULEDS FROM SHIFTS TO FILL AND ON-CALL EMPLOYEES
    //1. GRAB ON-CALL EMPLOYEES AND SORT BY SENIORITY
    const steadyExtras = yield employeeModel_1.default.find({ status: `on-call` });
    steadyExtras.sort((x, y) => x.seniority - y.seniority);
    //2. PREPARE VARS FOR SCHEDULED CREATION
    const allScheduled = [];
    let employeeIndex = 0;
    let employeeShiftsCounter = new Array(steadyExtras.length).fill(0);
    //3. USE RECURSION TO MANIPULATE EMPLOYEES TO ONLY HAVE 5 SHIFTS OR LESS
    const allScheduledFiller = () => {
        //3a. GO THROUGH EACH DAY ARR [MON[], TUE[], WED[], ETC.] AND ASSIGN FIRST SHIFT
        sortedShiftsToFill.forEach((shiftsOfTheDay) => {
            const employee = steadyExtras[employeeIndex];
            //3a.1 CONDITIONS TO START
            //     NO MORE SHIFTS, END LOOP
            if (shiftsOfTheDay.length === 0)
                return;
            //     ALL EMPLOYEES HAVE 5 SHIFTS, END RECURSION
            if (employeeShiftsCounter[employeeShiftsCounter.length - 1] === 5)
                return;
            //3a.2 CONDITION TO CONTINUE IF EMPLOYEE HASN'T MET 5 SHIFTS YET
            if (employeeShiftsCounter[employeeIndex] < 5) {
                //   FIND OUT DATE FOR THE SHIFT AND PARSE IT
                const firstShiftOfTheDay = shiftsOfTheDay[0];
                const comingMonday = moment_1.default().add(weekAhead, "w").isoWeekday(1);
                const parsedDate = comingMonday
                    .isoWeekday(firstShiftOfTheDay.day)
                    .toDate();
                //   ASSEMBLE SCHEDULED AND ADD TO WHAT WILL BE THE DOC
                allScheduled.push({
                    shift: firstShiftOfTheDay.id,
                    employee: employee.id,
                    scheduler,
                    date: parsedDate,
                });
                //   COUNT SHIFT THAT WAS SCHEDULED FOR EMPLOYEE
                employeeShiftsCounter[employeeIndex]++;
                //   DELETE SHIFT ALREADY SCHEDULED
                shiftsOfTheDay.shift();
            }
            else {
                return;
            }
            //3a.3 CONDITIONS TO END
            //     EMPLOYEE ALREADY HAS 5 SHIFTS, RETURN AND GO NEXT EMPLOYEE
            if (employeeShiftsCounter[employeeIndex] === 5)
                return;
            //     ALL EMPLOYEES HAVE 5 SHIFTS, END RECURSION
            if (employeeShiftsCounter[employeeShiftsCounter.length - 1] === 5)
                return;
        });
        //3b. MOVE TO NEXT EMPLOYEE ON NEXT LOOP THROUGH DAYS
        if (employeeIndex < steadyExtras.length)
            employeeIndex++;
        //3c. CONDITION TO CONTINUE
        //    DAY SHIFTS ALL SCHEDULED, DELETE THE DAY ARR
        if (sortedShiftsToFill[0].length === 0) {
            sortedShiftsToFill.shift();
        }
        //3d. CONDITIONS TO END
        //    REACHED LAST EMPLOYEE
        if (employeeShiftsCounter[employeeShiftsCounter.length - 1])
            return;
        //    ALL EMPLOYEES HAVE 5 SHIFTS, END RECURSION
        if (employeeShiftsCounter[employeeShiftsCounter.length - 1] === 5)
            return;
        //    ALL SHIFTS ARE SCHEDULED, END RECURSION
        if (sortedShiftsToFill.length === 0)
            return;
        //3e. GO THROUGH DAYS LOOP AGAIN
        allScheduledFiller();
    };
    //----C. CREATE ALL SCHEDULED AND SEND
    allScheduledFiller();
    const doc = yield scheduledModel_1.default.insertMany(allScheduled);
    res.status(201).json({
        status: `success`,
        results: allScheduled.length,
        doc,
    });
}));
//GET ALL SCHEDULED SHIFTS OF EMPLOYEE FROM EMPLOYEE ID (ENTERED)
exports.getEmployeeSchedule = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. ADD SEARCH FUNCTIONALITY
    const features = new apiFeatures_1.default(scheduledModel_1.default.find({ employee: req.params.id }), req.query)
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
    const shift = req.body.shift;
    const employee = req.body.employee;
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
        return next(new appError_1.default(`Last scheduled is in the past. Cannot delete.`, 400));
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
