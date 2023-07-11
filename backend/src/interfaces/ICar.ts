import { Document } from 'mongoose';

export interface ICar extends Document {
    frontLight?: boolean;
    backLight?: boolean;
    leftLight?: boolean;
    rightLight?: boolean;
    isStart?: boolean;
    battery?: string;
    latitude?: Number;
    longitude?: Number;
}
