import User from "../../../models/user/user.model";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import { UserStatus } from "../../../serviceImplementators/user/user.interfac";
const createAccount = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.refreshToken = '';
            await user.save();
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "User already exist!",
            });
        }
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            role: UserStatus.USER,
        });
        await newUser.save();
        const payload = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            isAdmin: newUser.role,
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
            isAdmin: newUser.role,
        };
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "User registration is successful!",
            user: safeUser,
            accessToken,
            refreshToken,
        });
    } catch (error: unknown) {
        console.error("Erorred occured!", error);
        if (error instanceof Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Something went wrong!",
                error: error.message,
            });
        }
    }
}

export default createAccount;