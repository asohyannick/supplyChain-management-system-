import { Schema , model} from "mongoose";
import { ISubscription } from "../../serviceImplementators/subscription/notification.interfac";
const subscriptionSchema: Schema = new Schema<ISubscription>({
    userId: {
        type: Schema.ObjectId,                      
        ref: 'User',        
    },
    subscription: {
        endpoint: { 
            type: String,   
        },      
        keys: {
            p256dh: { 
                type: String,   
            },
            auth: { 
                type: String,   
            },
        },
    },
}, {
    timestamps: true, 
});
const Subscription = model<ISubscription>('Subscription', subscriptionSchema);
export default Subscription;