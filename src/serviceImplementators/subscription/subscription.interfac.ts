import { Document, Types } from "mongoose";
export interface ISubscription extends Document {
    userId: Types.ObjectId
    subscription: {
    endpoint:string ,
    keys: {
        p256dh:string,
        auth: String,
    },
}
}