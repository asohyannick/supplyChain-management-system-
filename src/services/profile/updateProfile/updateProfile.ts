import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserProfile from '../../../models/profile/profile.model';
import bcrypt from 'bcryptjs';
const updateUserProfile = async (req: Request, res: Response): Promise<Response> => {
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
        let hashedPassword;
        if(password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        const updateData: any = {
            userId,
            firstName,
            lastName,
            email,
            password,
            role,
            drones,
        }
        if (hashedPassword) {
            updateData.password = hashedPassword;
        }
        const { id } = req.params;
        const existingProfile = await UserProfile.findByIdAndUpdate(id, {
         updateData,
        }, { new: true, runValidators: true});  
        if(!existingProfile) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Profile not found',
            });
        }   
        return res.status(StatusCodes.OK).json({
            message: 'Profile has been updated successfully',
            profile: existingProfile,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error({
                message: error.message,
                stack: error.stack
            });
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred while updating the profile.',
                error: error.message,
            });
        } else {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred while updating the profile.',
                error: String(error),
            });
        }
    }
}

export default updateUserProfile;