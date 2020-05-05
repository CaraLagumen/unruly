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
const weeklyShiftModel_1 = __importDefault(require("../../models/shift/weeklyShiftModel"));
const shiftModel_1 = __importDefault(require("../../models/shift/shiftModel"));
const factory = __importStar(require("../handlerFactory"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
//----------------------FOR SCHEDULER USE
exports.validateWeeklyShiftDays = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GRAB RAW SHIFTS FROM ENTERED SHIFT IDS FOR ELABORATE COMPARISON
    const shifts = [
        yield shiftModel_1.default.findById(req.body.shiftDay1),
        yield shiftModel_1.default.findById(req.body.shiftDay2),
        yield shiftModel_1.default.findById(req.body.shiftDay3),
        yield shiftModel_1.default.findById(req.body.shiftDay4),
        yield shiftModel_1.default.findById(req.body.shiftDay5),
    ];
    //2. CREATE ARR WITH DAYS (MON, TUES, ETC...) TO FIND DUPLICATES
    const days = shifts.map((el) => el.day);
    const duplicates = days.filter((el, i) => days.indexOf(el) !== i);
    //3. THROW ERROR IF DUPLICATES FOUND
    if (duplicates.length !== 0) {
        return next(new appError_1.default(`Duplicate shift days found. Please enter unique shift days.`, 400));
    }
    //4. ALLOW CREATION IF NO DUPLICATES
    next();
}));
exports.insertUpdatedWeeklyShift = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. GRAB RAW WEEKLY SHIFT FROM PARAM ID FOR ELABORATE COMPARISON
    const weeklyShift = yield weeklyShiftModel_1.default.findById(req.params.id);
    //2. CREATE OBJ TO BE COMPATIBLE WITH ENTERED JSON
    //   ALL IDS GRABBED TO ACCOUNT FOR ANY SHIFT CHOSEN TO REPLACE
    let shifts = {
        shiftDay1: weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay1.id,
        shiftDay2: weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay2.id,
        shiftDay3: weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay3.id,
        shiftDay4: weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay4.id,
        shiftDay5: weeklyShift === null || weeklyShift === void 0 ? void 0 : weeklyShift.shiftDay5.id,
    };
    //3. GRAB ENTERED SHIFTS FOR REPLACEMENT
    const shiftsToBeReplaced = req.body;
    //4. REPLACE
    Object.assign(shifts, shiftsToBeReplaced);
    //5. SEND NEW req.body
    req.body = shifts;
    next();
}));
exports.getAllWeeklyShifts = factory.getAll(weeklyShiftModel_1.default);
exports.getWeeklyShift = factory.getOne(weeklyShiftModel_1.default);
exports.createWeeklyShift = factory.createOne(weeklyShiftModel_1.default);
exports.updateWeeklyShift = factory.updateOne(weeklyShiftModel_1.default);
exports.deleteWeeklyShift = factory.deleteOne(weeklyShiftModel_1.default);
