import { Request, Response } from "express";
import User from "../../../models/user/user.model";
import bcrypt from 'bcryptjs';
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email, isAdmin: true });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User doesn't exist!",
            });
        }
        const comparedPassword = await bcrypt.compare(password,  user.password);
        if (!comparedPassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid Credentials",
            });
        }
        const accessToken = jwt.sign({ id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, password: user.password, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '50m',
        });
        const refreshToken = jwt.sign({ id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, password: user.password, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '7h',
        });
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('auth', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV as string === 'production',
            maxAge: 90000,
            sameSite: 'strict',
        });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "User login has been done successfully!",
            user,
            accessToken,
            refreshToken,
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

export default signin;