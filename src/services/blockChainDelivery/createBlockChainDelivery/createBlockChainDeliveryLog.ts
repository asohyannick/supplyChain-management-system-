import { Request, Response } from 'express';
import Web3 from 'web3';
import 'dotenv/config';
import { abi }  from '../deliveryJson/deliveryJson';
import BlockChainDelivery from '../../../models/blockChainDelivery/blockChainDelivery.model';
import { StatusCodes } from 'http-status-codes';
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL as string));
const contractAddress = process.env.CONTRACT_ADDRESS as string;
if (!contractAddress || !/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
    throw new Error('Invalid CONTRACT_ADDRESS in the environment variables');
}
const deliveryContract = new web3.eth.Contract(abi, contractAddress);
const createBlockChainDeliveryLog = async (req: Request, res: Response): Promise<Response> => {
    const { userId, deliveryDetails } = req.body;
    try {
        const accounts = await web3.eth.getAccounts();
        const receipt = await deliveryContract.methods.logDelivery(deliveryDetails).send({ from: accounts[0] });
        const deliveryLog = new BlockChainDelivery({
            userId,
            deliveryDetails,
            timestamp: Date.now(),
            blockchainHash: receipt.transactionHash,
        });
        await deliveryLog.save();
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Blockchain delivery logged  has been created successfully!',
            transactionHash: receipt.transactionHash,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error instanceof Error ? error.message : 'An error occurred while logging the delivery on the blockchain.',
            error: error instanceof Error ? error.stack : 'Unknown error',
        });
    }
};

export default createBlockChainDeliveryLog;