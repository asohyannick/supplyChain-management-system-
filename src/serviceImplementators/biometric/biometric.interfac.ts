import { Document, Types } from 'mongoose';
export interface IBiometricData extends Document {
    userId: Types.ObjectId;
    fingerprintData: string;
    facialRecognitionData: string;
    irisScanData: string;
}