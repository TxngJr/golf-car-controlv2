import { Document, Types } from 'mongoose';

export interface IRecord extends Document {
  carId: Types.ObjectId;
  startTime: Date;
  endTime?: Date;
}
