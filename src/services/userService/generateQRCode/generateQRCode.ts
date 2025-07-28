import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../../../models/user/user.model';
import QrCode from 'qrcode';
const generateQRCode = async (req: Request, res: Response) => {
    const { id } = req.params;  
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'User not found',
            });
        }
        const qrCodeSecret = user.qrCodeSecret;
        if (!qrCodeSecret) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'QR Code secret not found for this user',
            });
        }       
        const qrCodeData = await QrCode.toDataURL(qrCodeSecret);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'QR Code generated successfully',
            qrCode: qrCodeData,
        });
    }
    catch (error: unknown) {
        console.error('Error generating QR Code:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'An error occurred while generating QR Code',
        });
    }  
};

export default generateQRCode;