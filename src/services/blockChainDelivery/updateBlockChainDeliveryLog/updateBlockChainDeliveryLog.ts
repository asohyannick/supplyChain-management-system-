import { Request, Response } from 'express';
import 'dotenv/config';
import Web3 from 'web3';
import BlockChainDelivery from '../../../models/blockChainDelivery/blockChainDelivery.model';
import { StatusCodes } from 'http-status-codes';
import 'dotenv/config';
import { abi }  from '../deliveryJson/deliveryJson';
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL as string));
const contractAddress = process.env.CONTRACT_ADDRESS as string;
if (!contractAddress || !/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
    throw new Error('Invalid CONTRACT_ADDRESS in the environment variables');
}
const deliveryContract = new web3.eth.Contract(abi, contractAddress);
const updateBlockChainDeliveryLog = async(req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { userId, deliveryDetails } = req.body;
        const accounts = await web3.eth.getAccounts();
        const receipt = await deliveryContract.methods.logDelivery(deliveryDetails).send({ from: accounts[0] });
        const blockDeliveryLog = await BlockChainDelivery.findByIdAndUpdate(id, {
            userId,
            deliveryDetails,
            timestamp: Date.now(),
            blockchainHash: receipt.transactionHash,
        }, 
            { new: true, runValidators: true}
        );
        if (!blockDeliveryLog) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Block chain delivery log doesn't exist!"
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Blockchain delivery logs have been fetched successfully!',
            data: blockDeliveryLog,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error instanceof Error ? error.message : 'An error occurred while logging the delivery on the blockchain.',
            error: error instanceof Error ? error.stack : 'Unknown error',
        });
    }
};

export default updateBlockChainDeliveryLog;