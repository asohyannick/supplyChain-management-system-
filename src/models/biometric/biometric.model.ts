import { Schema, model } from 'mongoose';
import { IBiometricData } from '../../serviceImplementators/biometric/biometric.interfac';
const biometricSchema: Schema = new Schema<IBiometricData>({
userId:{
    type: Schema.ObjectId,
    ref: 'User',
},
fingerprintData:{
    type: String,
},
facialRecognitionData:{
    type: String,
},
irisScanData:{
    type: String,
},
}, { timestamps: true});
const BiometricData = model<IBiometricData>('Biometric', biometricSchema);
export default BiometricData;