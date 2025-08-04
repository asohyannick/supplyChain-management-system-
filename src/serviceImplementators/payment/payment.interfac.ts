import { Document } from "mongoose";
import { Currency, PaymentStatus } from "../../enums/stripe/stripe.constants";
export interface IPayment extends Document {
    paymentIntentId: string;
    amount: number;
    currency: Currency;
    status: PaymentStatus;
    lastUpdated?: Date;
}