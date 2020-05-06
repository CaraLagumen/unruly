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
const factory = __importStar(require("../handlerFactory"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
//----------------------FOR SCHEDULER USE
exports.getShiftsByHour = catchAsync_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //FIND HOURS INCLUDING PARTIAL MATCHES
    const doc = yield shiftModel_1.default.find({
        $or: [
            { shiftStart: req.query.shiftStart },
            { shiftEnd: req.query.shiftEnd },
        ],
    });
    res.status(200).json({
        status: `success`,
        doc,
    });
}));
exports.getAllShifts = factory.getAll(shiftModel_1.default);
exports.getShift = factory.getOne(shiftModel_1.default);
exports.createShift = factory.createOne(shiftModel_1.default);
exports.updateShift = factory.updateOne(shiftModel_1.default);
exports.deleteShift = factory.deleteOne(shiftModel_1.default);
