import { model, Schema } from "mongoose";
import { DroneStatus, IDrone } from "../../serviceImplementators/drone/drone.interfac";
const droneSchema: Schema = new Schema<IDrone>({
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
    batteryLevel:{
        type:Number,
    },
}, { timestamps: true });
const Drone = model<IDrone>("Drone", droneSchema);
export default Drone;