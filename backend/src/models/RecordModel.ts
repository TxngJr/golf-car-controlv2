import mongoose, { Schema } from 'mongoose';
import { IRecord } from '../interfaces/IRecord';

const RecordSchema: Schema = new Schema({
    carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    startTime: { type: String, required: true },
    endTime: { type: String },
});

const RecordModel = mongoose.model<IRecord>('Record', RecordSchema);

export default RecordModel;