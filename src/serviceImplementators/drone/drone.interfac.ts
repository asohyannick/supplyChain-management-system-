import { Document, Types } from "mongoose";
export enum DroneStatus {
    AVAILABLE = 'Available',
    BUSY = 'Busy',
    OFFLINE = 'Offline',
}
export interface IDrone extends Document {
    userId: Types.ObjectId,
    droneId: string;
    pickupTime: Date;
    distance: number; // Distance to the pickup location
    location: {
        latitude: number;
        longitude: number;
    };
    status: DroneStatus;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    notes: string;
    packageDetails: [{
        weight: number;
        dimensions: {
            length: number;
            width: number;
            height: number;
        },
        description: string;
    }],
    batteryLevel: number;  
}
