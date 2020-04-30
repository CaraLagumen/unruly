import { Document } from "mongoose";

interface IScheduled extends Document {
  shift: string;
  employee: string;
  scheduler: string;
  date: Date;
  createdAt: Date;
}

export default IScheduled;
