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
const vacationModel_1 = __importDefault(require("../../models/shift/vacationModel"));
const factory = __importStar(require("../handlerFactory"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const appError_1 = __importDefault(require("../../utils/appError"));
//----------------------FOR EMPLOYEE USE
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
exports.getAllVacations = factory.getAll(vacationModel_1.default);
exports.getVacation = factory.getOne(vacationModel_1.default);
exports.createVacation = factory.createOne(vacationModel_1.default);
exports.updateVacation = factory.updateOne(vacationModel_1.default);
exports.deleteVacation = factory.deleteOne(vacationModel_1.default);
