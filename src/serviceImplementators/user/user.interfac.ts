import { Document } from "mongoose";
import { UserStatus } from "../../enums/user/user.constants";
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role:UserStatus;
    refreshToken: string;
    biometricData: string;
    qrCodeSecret: string;
}