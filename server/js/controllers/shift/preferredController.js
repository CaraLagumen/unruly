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
const preferredModel_1 = __importDefault(require("../../models/shift/preferredModel"));
const factory = __importStar(require("../handlerFactory"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const appError_1 = __importDefault(require("../../utils/appError"));
//----------------------FOR EMPLOYEE USE
//TOOLS----------------------------------------------------------
//GRAB SHIFT ID FROM PREFERRED FOR VALIDATION ON UPDATE
exports.getBody = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const preferred = yield preferredModel_1.default.findById(req.params.id);
    req.body.shift = preferred === null || preferred === void 0 ? void 0 : preferred.shift.id;
    next();
}));
//EACH EMPLOYEE SHOULD ONLY HAVE 3 PREFERRED PER DAY
//ENSURE PREFERRED IS NOT THE 4TH PREFERRRED SHIFT OF THE DAY
exports.validatePreferred = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. FIND EQUIVALENT SHIFT FROM SHIFT ID (ENTERED) AND RANK (ENTERED)
    const shift = yield shiftModel_1.default.findById(req.body.shift);
    const rank = req.body.rank;
    //2. FIND ALL PREFERRED BELONGING TO EMPLOYEE AND FILTER BY
    //   MATCHING THE PREFERRED SHIFT DAYS TO THE ENTERED SHIFT DAY
    const allMyPreferred = yield preferredModel_1.default.find({ employee: req.employee.id });
    const allMyPreferredOfTheDay = allMyPreferred.filter((preferred) => preferred.shift.day === (shift === null || shift === void 0 ? void 0 : shift.day));
    //3. FILTER RANK BY MATCHING PREFERRED RANK TO THE ENTERED RANK
    const preferredRankMatch = allMyPreferredOfTheDay.filter((preferred) => preferred.rank === rank);
    //4. ERROR IF FOUND A MATCHED RANK
    if (preferredRankMatch.length > 0) {
        return next(new appError_1.default(`Rank is a duplicate. Please enter a different rank.`, 400));
    }
    //5. ERROR IF PREFERRED FOR THE DAY EXCEEDED
    if (allMyPreferredOfTheDay.length > 2) {
        return next(new appError_1.default(`Number of preferred for this day exceeded. Only 3 allowed per day.`, 400));
    }
    //4. ALLOW WHEN ALL VALIDATED
    next();
}));
//MAIN----------------------------------------------------------
//SAVE PREFERRED OF LOGGED IN EMPLOYEE FROM SHIFT ID (ENTERED)
exports.saveMyPreferred = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const shift = req.body.shift;
    const employee = req.employee.id;
    const rank = req.body.rank;
    const doc = yield preferredModel_1.default.create({ shift, employee, rank });
    res.status(201).json({
        status: `success`,
        doc,
    });
}));
//UPDATE PREFERRED OF LOGGED IN EMPLOYEE FROM PREFERRED ID (ENTERED)
exports.updateMyPreferred = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield preferredModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc) {
        return next(new appError_1.default(`No document found with that ID.`, 404));
    }
    res.status(201).json({
        status: `success`,
        doc,
    });
}));
//DELETE PREFERRED OF LOGGED IN EMPLOYEE FROM PREFERRED ID (PARAM)
exports.deleteMyPreferred = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield preferredModel_1.default.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new appError_1.default(`No document found with that ID.`, 404));
    }
    res.status(204).json({
        status: `success`,
        doc: null,
    });
}));
//GET ALL PREFERRED OF LOGGED IN EMPLOYEE
exports.getAllMyPreferred = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. ADD SEARCH FUNCTIONALITY
    const features = new apiFeatures_1.default(preferredModel_1.default.find({ employee: req.employee.id }), req.query)
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
exports.getAllPreferred = factory.getAll(preferredModel_1.default);
exports.getPreferred = factory.getOne(preferredModel_1.default);
exports.deletePreferred = factory.deleteOne(preferredModel_1.default);
