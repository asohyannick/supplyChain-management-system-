import { model, Schema } from "mongoose";
import { IMailPickUp } from "../../serviceImpls/mailPickUp/mailPickUp.interfac";
const mailPickUpSchema: Schema = new Schema<IMailPickUp>({
    userId: {
        type: Schema.ObjectId,
        ref: 'User',
    },
    pickupTime: {
        type: Date,
        default: Date.now,
    },
    address: {
        street: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        zipCode: {
            type: String,
        },
        country: {
            type: String,
        },
    },
    notes: {
        type: String,
    },
    packageDetails: [{
        weight: {
            type: Number,
        },
        dimensions: {
            length: {
                type: Number,
            },
            width: {
                type: Number,
            },
            height: {
                type: Number,
            },
        },
        description: {
            type: String,
        },
    }],
}, { timestamps: true });
const MailPickUp = model<IMailPickUp>("MailPickUp", mailPickUpSchema);
export default MailPickUp;