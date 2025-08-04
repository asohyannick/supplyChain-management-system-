import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserProfile from '../../../models/profile/profile.model';
const deleteUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const existingProfile = await UserProfile.findByIdAndDelete(id); 
        if(!existingProfile) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Profile not found',
            });
        }   
        return res.status(StatusCodes.OK).json({
            message: 'Profile has been deleted successfully',
            profile: existingProfile,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error({
                message: error.message,
                stack: error.stack
            });
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred while deleting the profile.',
                error: error.message,
            });
        } else {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred while deleting the profile.',
                error: String(error),
            });
        }
    }
}

export default deleteUserProfile;