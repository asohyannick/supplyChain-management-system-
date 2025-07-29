import { Request, Response } from 'express';
import 'dotenv/config';
import BlockChainDelivery from '../../../models/blockChainDelivery/blockChainDelivery.model';
import { StatusCodes } from 'http-status-codes';
const showBlockChainDeliveryLogs = async(_req: Request, res: Response): Promise<Response> => {
    try {
        const blockDeliveryLogs = await BlockChainDelivery.find();
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Blockchain delivery logs have been fetched successfully!',
            data: blockDeliveryLogs,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error instanceof Error ? error.message : 'An error occurred while logging the delivery on the blockchain.',
            error: error instanceof Error ? error.stack : 'Unknown error',
        });
    }
};

export default showBlockChainDeliveryLogs;