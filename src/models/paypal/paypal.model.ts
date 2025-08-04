import  { Schema, model } from 'mongoose';
import { PayPalPaymentStatus } from '../../enums/paypal/paypal.constants';
import { IPaypal } from '../../serviceImplementators/paypal/paypal.interface';
const paypalSchema: Schema = new Schema<IPaypal>({
 paymentId: {
   type: String,
 },
 amount:{
    type: Number,
 },
 status:{
    type:String,
    enum:Object.values(PayPalPaymentStatus),
    default: PayPalPaymentStatus.PENDING,
 },
}, {timestamps: true});
const PayPalTransaction = model<IPaypal>('PayPalTransaction', paypalSchema);
export default PayPalTransaction;