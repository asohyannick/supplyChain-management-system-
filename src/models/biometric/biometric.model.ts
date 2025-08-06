import { Schema, model } from 'mongoose';
import { IBiometricData } from '../../serviceImplementators/biometric/biometric.interfac';
const biometricSchema: Schema = new Schema<IBiometricData>({
userId:{
    type: Schema.ObjectId,
    ref: 'User',
},
fingerprint:{
    type: String,
},
facialRecognition:{
    type: String,
},
irisScan:{
    type: String,
},
}, { timestamps: true});
const BiometricData = model<IBiometricData>('Biometric', biometricSchema);
export default BiometricData;