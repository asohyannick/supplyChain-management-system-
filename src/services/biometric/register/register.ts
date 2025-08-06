import BiometricData from '../../../models/biometric/biometric.model';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
const register = async(req: Request, res: Response): Promise<Response> => {
    const { userId, fingerprint, facialRecognition, irisScan } = req.body;
    try {
        const biometricData = new BiometricData({
            userId,
            fingerprint,
            facialRecognition,
            irisScan
        });
        await biometricData.save();
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Biometric data registered successfully",
            data: biometricData,
        });
    } catch (error) {
        console.error("Error occured!", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
}

export default register;