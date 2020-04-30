import { Document } from "mongoose";

interface IPreferred extends Document {
  shift: string;
  employee: string;
  rank: number;
  createdAt: Date;
}

export default IPreferred;
