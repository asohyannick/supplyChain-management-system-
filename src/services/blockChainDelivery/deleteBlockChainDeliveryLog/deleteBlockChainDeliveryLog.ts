import { Request, Response } from 'express';
import 'dotenv/config';
import BlockChainDelivery from '../../../models/blockChainDelivery/blockChainDelivery.model';
import { StatusCodes } from 'http-status-codes';
const deleteBlockChainDeliveryLog = async(req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const blockDeliveryLog = await BlockChainDelivery.findByIdAndDelete(id);
        if (!blockDeliveryLog) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Block chain delivery log doesn't exist!"
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Blockchain delivery log have been deleted successfully!',
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

export default deleteBlockChainDeliveryLog;