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
const shiftModel_1 = __importDefault(require("../../models/shift/shiftModel"));
const weeklyShiftModel_1 = __importDefault(require("../../models/shift/weeklyShiftModel"));
const weeklyScheduledModel_1 = __importDefault(require("../../models/shift/weeklyScheduledModel"));
const factory = __importStar(require("../handlerFactory"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
//----------------------FOR SCHEDULER USE
//TOOLS----------------------------------------------------------
//FOR UPDATES AND USING validateWeeklyShiftDays
//CREATE REF SINCE req.body WILL HAVE INCOMPLETE INFO FOR VALIDATION
exports.setupUpdatedWeeklyShift = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GRAB RAW WEEKLY SHIFT FROM PARAM ID FOR ELABORATE COMPARISON
    const weeklyShift = yield weeklyShiftModel_1.default.findById(req.params.id);
    //2. CREATE OBJ TO BE COMPATIBLE WITH ENTERED JSON
    //   ALL IDS GRABBED TO ACCOUNT FOR ANY SHIFT CHOSEN TO REPLACE
    let shiftsRef = {
        shiftDay1: weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay1.id,
        shiftDay2: weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay2.id,
        shiftDay3: weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay3.id,
        shiftDay4: weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay4.id,
        shiftDay5: weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay5.id,
    };
    //3. GRAB ENTERED SHIFTS FOR REPLACEMENT
    const shiftsToBeReplaced = req.body;
    //4. REPLACE
    Object.assign(shiftsRef, shiftsToBeReplaced);
    //5. SEND NEW req.body
    req.body = shiftsRef;
    next();
}));
exports.validateWeeklyShift = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //----A. ENSURE ALL SHIFTS HAVE DIFFERENT DAYS (MON, TUES, ETC...)
    //1. GRAB RAW SHIFTS FROM ENTERED SHIFT IDS FOR ELABORATE COMPARISON
    const shifts = [
        yield shiftModel_1.default.findById(req.body.shiftDay1),
        yield shiftModel_1.default.findById(req.body.shiftDay2),
        yield shiftModel_1.default.findById(req.body.shiftDay3),
        yield shiftModel_1.default.findById(req.body.shiftDay4),
        yield shiftModel_1.default.findById(req.body.shiftDay5),
    ];
    //SORT BY DAY FOR USE WITH B.
    shifts.sort((el1, el2) => el1.day - el2.day);
    //2. CREATE ARR WITH DAYS (MON, TUES, ETC...) TO FIND DUPLICATES
    const days = shifts.map((el) => el.day);
    const duplicates = days.filter((el, i) => days.indexOf(el) !== i);
    //3. ERROR IF DUPLICATE DAYS FOUND
    if (duplicates.length !== 0) {
        return next(new appError_1.default(`Duplicate shift days found. Please enter unique shift days.`, 400));
    }
    //----B. ENSURE ALL SHIFTS HAVE AT LEAST 8 HOURS APART
    //TO-DO: VALIDATE THAT IF shiftDay5 IS SATURDAY AND shiftDay1 IS SUNDAY,
    //       THEY ARE ALSO 8 HOURS IN BETWEEN
    //1. CREATE ARRS WITH HOURS TO COMPARE (ARR: [[4, 0], [4, 0], ETC...])
    const startHours = shifts.map((el) => el.shiftStart);
    const endHours = shifts.map((el) => el.shiftEnd);
    //2. CHECK ONLY THE CONSECUTIVE DAYS, DELETE IF NOT
    for (let i = 0; i < days.length; i++) {
        if (i === 4) {
            //DON'T COMPARE IF IT'S THE LAST DAY
            continue;
        }
        else if (days[i + 1] - days[i] !== 1) {
            //CHECK DAY AFTER MINUS DAY BEFORE TO SEE IF IT'S 1 DAY APART
            //IF IT'S NOT 1 DAY APART, REMOVE FROM COMPARISON
            startHours.splice(i + 1, 1);
            endHours.splice(i + 1, 1);
        }
    }
    //3. CHECK ONLY TIME IN BETWEEN END SHIFT OF DAY BEFORE
    //   AND START SHIFT OF DAY AFTER BY OFFSETTING ARRS
    startHours.splice(0, 1);
    endHours.splice(endHours.length - 1, 1);
    //4. CONVERT ARRS TO FAKE DATES FOR EASIER TIME COMPARISON
    const startHoursInGetTimeForm = startHours.map((el, i) => {
        return new Date(1991, 8, i + 2, el[0]).getTime();
    });
    const endHoursInGetTimeForm = endHours.map((el, i) => {
        return new Date(1991, 8, i + 1, el[0]).getTime();
    });
    const hoursInBetween = 28800000; //8 HOURS IN MILLISECONDS
    //5. LOOP THROUGH ARRS TO FIND DIFFERENCE IN HOURS
    for (let i = 0; i < startHoursInGetTimeForm.length; i++) {
        const difference = startHoursInGetTimeForm[i] - endHoursInGetTimeForm[i];
        //6. ERROR IF DIFFERENCE LESS THAN 8
        if (difference < hoursInBetween) {
            return next(new appError_1.default(`Overtime found. Please enter shifts with no overtime.`, 400));
        }
    }
    //----C. ALLOW NEXT WHEN ALL VALIDATED
    next();
}));
exports.deleteWeeklyShiftConnections = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const weeklyShift = (yield weeklyShiftModel_1.default.findById(req.params.id));
    yield weeklyScheduledModel_1.default.findOneAndDelete({ weeklyShift });
    next();
}));
//STANDARD----------------------------------------------------------
exports.getAllWeeklyShifts = factory.getAll(weeklyShiftModel_1.default);
exports.getWeeklyShift = factory.getOne(weeklyShiftModel_1.default);
exports.createWeeklyShift = factory.createOne(weeklyShiftModel_1.default);
exports.updateWeeklyShift = factory.updateOne(weeklyShiftModel_1.default);
exports.deleteWeeklyShift = factory.deleteOne(weeklyShiftModel_1.default);
