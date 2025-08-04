import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserProfile from '../../../models/profile/profile.model';
const createUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {
            userId,
            firstName,
            lastName,
            email,
            password,
            role,
            drones,
        } = req.body;
        const newProfile = new UserProfile({
            userId,
            firstName,
            lastName,
            email,
            password,
            role,
            drones,
        });
        const savedProfile = await newProfile.save();
        return res.status(StatusCodes.CREATED).json({
            message: 'Profile created successfully',
            profile: savedProfile,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error({ 
                message: error.message, 
                stack: error.stack 
            });
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message:'An error occurred while creating the profile.',
                error: error.message,
            });
        } else {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message:'An error occurred while creating the profile.',
                error: String(error),
            });
        }
    }
}

export default createUserProfile;