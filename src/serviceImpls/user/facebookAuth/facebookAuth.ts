import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import axios from 'axios';
const facebookAuth = async (req: Request, res: Response) => {
    const { accessToken } = req.body;
    try {
        if (!accessToken) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid Token"
            });
        }
        const tokenValidationResponse = await axios.get(`https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.FACEBOOK_APP_ID as string}|${process.env.FACEBOOK_APP_SECRET as string}`);
        const isValidToken = tokenValidationResponse.data.data.is_valid;
        if (!isValidToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Invalid access token"
            });
        }
        const response = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`);
        const userData = response.data;
        const token = jwt.sign({ id: userData.id, email: userData.email }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '1h',
        });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "User login is successful!",
            token,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error verifying Facebook token:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Something went wrong!",
                error: error.message,
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Unknown error occurred",
        });
    }
}

export default facebookAuth;