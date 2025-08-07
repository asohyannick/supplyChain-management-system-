import User from "../../../models/user/user.model";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import { UserStatus } from "../../../enums/user/user.constants";
const createAccount = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password , role} = req.body;
    try {
        const qrCodeSecret = Math.random().toString(32).substring(2, 10); 
        const user = await User.findOne({ email });
        if (user) {
            user.refreshToken = '';
            await user.save();
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "User already exist!",
            });
        }
        let userRole = UserStatus.USER; 
        if (role) {
            if ([UserStatus.ADMIN,UserStatus.DISPATCHER,UserStatus.DRONE_OPERATOR].includes(role)) {
                const requesterRole = req.user?.role; 
                if (requesterRole !== UserStatus.ADMIN && requesterRole !== UserStatus.DISPATCHER && requesterRole !== UserStatus.DRONE_OPERATOR) {
                    return res.status(StatusCodes.FORBIDDEN).json({
                        success: false,
                        message: "You do not have permission to assign this role.",
                    });
                }
                userRole = role; 
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid role specified.",
                });
            }
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            role: userRole,
            qrCodeSecret
        });
        await newUser.save();
        const payload = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '50m',
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '7h',
        });
        newUser.refreshToken = refreshToken;
        await newUser.save();
        res.cookie('auth', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV as string === 'production',
            maxAge: 90000,
            sameSite: 'strict',
        });
        const safeUser = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
        };
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "User registration is successful!",
            user: safeUser,
            accessToken,
            refreshToken,
            qrCodeSecret,
        });
    } catch (error) {
        console.error("Error occurred!", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Something went wrong!",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

export default createAccount;
