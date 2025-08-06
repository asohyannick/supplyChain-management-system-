import { Document } from 'mongoose';
export interface IBiometricData extends Document {
    userId: Types.ObjectId;
    fingerprint: string;
    facialRecognition: string;
    irisScan: string;
}