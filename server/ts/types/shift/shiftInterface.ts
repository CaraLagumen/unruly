import { Document } from "mongoose";

interface IShift extends Document {
  position: string;
  slot: string;
  location: string;
  day: number;
  hours: number[];
}

export default IShift;
