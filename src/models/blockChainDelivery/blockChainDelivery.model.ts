import { model, Schema } from "mongoose";
import { IBlockChainDelivery } from '../../serviceImplementators/blockChainDelivery/blockChainDelivery.interfac';
const blockChainDeliverySchema = new Schema<IBlockChainDelivery>({
    userId: {
        type: Schema.ObjectId,
        ref: 'User',
    },
    deliveryDetails: {
        type: String,
    },
    timestamp: { 
        type: Date,
        default: Date.now,
    },
    blockchainHash: {
        type: String,
    },
}, { timestamps: true });

const BlockChainDelivery = model<IBlockChainDelivery>("BlockChainDeliveryLog", blockChainDeliverySchema);
export default BlockChainDelivery;
