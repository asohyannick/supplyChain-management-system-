import { Document } from 'mongoose';
import { PayPalPaymentStatus } from '../../enums/paypal/paypal.constants';
export interface IPaypal extends Document {
    paymentId:string;
    payerId: string;
    amount: number;
    status: PayPalPaymentStatus;
} 