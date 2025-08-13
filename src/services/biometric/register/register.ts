import BiometricData from '../../../models/biometric/biometric.model';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as faceapi from 'face-api.js';
import Fingerprint from 'node-fingerprint';
import * as Jimp from 'jimp';
const processIrisImage = async (irisData: string): Promise<string> => {
    // Load the iris image using Jimp
    const image = await Jimp.read(Buffer.from(irisData, 'base64'));
    // Convert to grayscale
    image.grayscale();
    // Resize the image to standard dimensions
    image.resize(256, 256);
    // Crop the image to focus on the iris area
    const irisRegion = image.clone().crop(64, 64, 128, 128);
    // Convert the processed image back to base64
    const base64Image = await new Promise<string>((resolve, reject) => {
        irisRegion.getBase64(Jimp.MIME_PNG, (err: Error | null, res: string) => {
            if (err) reject(err);
            else resolve(res);
        });
    });

    return base64Image; // Return the base64 string
};
const authenticate = async(req:Request, res: Response) => {
    const { fingerprintData, facialRecognitionData, irisScanData } = req.body;
    try {
        const { id } = req.query;
        const user  = await BiometricData.findById(id);
        if(!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User doesn't exist!",
            });
        }
        const fingerPrint  = await Fingerprint.create(fingerprintData);
        // Create an HTMLImageElement
        const img = new Image();
        img.src = `data:image/jpeg;base64,${facialRecognitionData}`;
        
        // Wait for the image to load before detection
        img.onload = async () => {
            const detection = await faceapi.detectSingleFace(img);

            if (!detection) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Facial recognition failed!",
                });
            }

            const biometricData = new BiometricData({
                fingerprintData: fingerPrint,
                facialRecognitionData: detection,
                irisScanData: processIrisImage,
            });

            await biometricData.save();
            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Biometric data registered successfully",
                data: biometricData,
            });
        };
        img.onerror = (error) => {
            console.error("Image loading error:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error loading image for facial recognition.",
            });
        }
    } catch (error) {
        console.error("Error occured!", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
}

export default authenticate;