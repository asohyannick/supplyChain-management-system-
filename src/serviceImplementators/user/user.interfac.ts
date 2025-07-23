import { Document } from "mongoose";
export enum  UserStatus {
    ADMIN = 'Admin',
    DISPATCHER = 'Dispatcher',
    DRONE_OPERATOR = 'Drone Operator',
    USER = 'User',
}
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role:UserStatus;
    refreshToken: string;
}