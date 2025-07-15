import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../../../models/user/user.model";
import jwt, { JwtPayload } from 'jsonwebtoken';
const requestAccessToken = async (req: Request, res: Response): Promise<Response> => {
    const { refreshToken } = req.body;
    try {
        if (!refreshToken) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid Credentials",
            });
        }
        const userPayload = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY as string) as JwtPayload;
        const user = await User.findById(userPayload.id);
        if (!user || refreshToken !== refreshToken) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid Credentials",
            });
        }
        const accessToken = jwt.sign({ id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, password: user.password, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '50m',
        });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "A new access token has been generated successsfully!",
            accessToken
        });
    } catch (error) {
        console.error("Error occured!", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Something went wrong!",
            error: error instanceof Error ? error.message : "Unknown Error Message",
        });
    }
}

export default requestAccessToken;