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
const schedulerModel_1 = __importDefault(require("../../models/users/schedulerModel"));
const factory = __importStar(require("../handlerFactory"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
//TOOLS----------------------------------------------------------
//FILTERED FIELDS FOR updateMe
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el))
            newObj[el] = obj[el];
    });
    return newObj;
};
//MAIN----------------------------------------------------------
//GET LOGGED IN SCHEDULER
exports.getMe = (req, res, next) => {
    req.params.id = req.scheduler.id;
    next();
};
//UPDATE LOGGED IN SCHEDULER
exports.updateMe = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1. CREATE ERROR IF SCHEDULER POSTS PASSWORD DATA
    if (req.body.password || req.body.passwordConfirm) {
        return next(new appError_1.default(`This route is not for password updates. Use /updateMyPassword.`, 400));
    }
    //2. FILTER FIELD NAMES THAT ARE ALLOWED TO BE UPDATED
    const filteredBody = filterObj(req.body, `email`);
    //3. UPDATE SCHEDULER DOC
    const updatedScheduler = yield schedulerModel_1.default.findByIdAndUpdate(req.scheduler.id, filteredBody, {
        new: true,
        runValidators: true,
    });
    //4. SEND UPDATED SCHEDULER
    res.status(200).json({
        status: `success`,
        user: updatedScheduler,
    });
}));
//STANDARD----------------------------------------------------------
exports.getAllSchedulers = factory.getAll(schedulerModel_1.default);
exports.getScheduler = factory.getOne(schedulerModel_1.default);
exports.createScheduler = factory.createOne(schedulerModel_1.default);
exports.updateScheduler = factory.updateOne(schedulerModel_1.default);
exports.deleteScheduler = factory.deleteOne(schedulerModel_1.default);
