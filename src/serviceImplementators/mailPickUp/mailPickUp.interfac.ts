import { Document, Types } from "mongoose";
export interface IMailPickUp extends Document {
    userId: Types.ObjectId,
    pickupTime: Date;
    address:{
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    notes: string;
    packageDetails:[{
        weight:number;
        dimensions:{
            length: number;
            width: number;
            height: number;
        },
        description: string;
    }]
}