import { Document, Types } from "mongoose";
import { DroneStatus } from "../../enums/drone/drone.constants";
import { UserStatus } from "../../enums/user/user.constants";
export interface IUserProfile extends Document {
    userId: Types.ObjectId;
    profilePicture: string;
    bio: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string; 
    role: UserStatus;
    drones: {
        droneId: string;
        status: DroneStatus;
        pickupTime: Date;
        distance: number; 
        location: {
            latitude: number;
            longitude: number;
        };
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
            };
            description: string;
        }];
        batteryLevel: number;  
    }[];
}