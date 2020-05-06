import { Document } from "mongoose";

interface IShift extends Document {
  position: string;
  slot: string;
  location: string;
  day: number;
  shiftStart: any; //ALLOW ANY FOR URL QUERIES
  shiftEnd: any; //ALLOW ANY FOR URL QUERIES
}

export default IShift;
