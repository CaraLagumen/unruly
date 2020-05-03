"use strict";
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
exports.getAllShifts = factory.getAll(shiftModel_1.default);
exports.getShift = factory.getOne(shiftModel_1.default);
exports.createShift = factory.createOne(shiftModel_1.default);
exports.updateShift = factory.updateOne(shiftModel_1.default);
exports.deleteShift = factory.deleteOne(shiftModel_1.default);
