import mongoose, { Schema } from 'mongoose';
import { ICar } from '../interfaces/ICar';

const CarSchema: Schema = new Schema({
    frontLight: { type: Boolean, default: false },
    backLight: { type: Boolean, default: false },
    leftLight: { type: Boolean, default: false },
    rightLight: { type: Boolean, default: false },
    isStart: { type: Boolean, default: false },
    battery: { type: Number, default: 0 },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
});

const CarModel = mongoose.model<ICar>('Car', CarSchema);

export default CarModel;
