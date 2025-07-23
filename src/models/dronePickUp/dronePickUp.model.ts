import { model, Schema } from "mongoose";
import { DroneStatus, IDronePickUp } from "../../serviceImplementators/dronelPickUp/dronePickUp.interfac";
const dronePickUpSchema: Schema = new Schema<IDronePickUp>({
    userId: {
        type: Schema.ObjectId,
        ref: 'User',
    },
    pickupTime: {
        type: Date,
        default: Date.now,
    },
    distance:{
        type: Number,
    },
    location:{
        latitude:{
            type:Number,
        },
        longitude:{
            type:Number,
        },
    },
    status:{
        type:String,
        enum: Object.values(DroneStatus),
        default: DroneStatus.BUSY,
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
const DronePickUp = model<IDronePickUp>("DronePickUp", dronePickUpSchema);
export default DronePickUp;