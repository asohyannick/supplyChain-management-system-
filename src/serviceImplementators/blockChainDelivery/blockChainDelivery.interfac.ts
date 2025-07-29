import { Document, Types } from 'mongoose';
export interface IBlockChainDelivery extends Document {
    userId:Types.ObjectId;
    deliveryDetails: string;
    timestamp: Date;
    blockchainHash: string;
}