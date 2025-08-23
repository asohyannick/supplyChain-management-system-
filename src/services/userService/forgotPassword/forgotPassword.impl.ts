import User from "../../../models/user/user.model";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found!",
            });
        }
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '1h',
        });

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER as string,
                pass: process.env.EMAIL_PASS as string,
            },
        });

        const resetLink = `${process.env.FRONTEND_DOMAIN as string}/reset-password/${resetToken}`;

        await transporter.sendMail({
            to: user.email,
            subject: "Request to Reset Your Password",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 8px; max-width: 600px; margin: auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p style="color: #555; font-size: 16px;">
                Dear User,
            </p>
            <p style="color: #555; font-size: 16px;">
                We received a request to reset your password. Please click the button below to reset your password.
            </p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">
                Reset Password
            </a>
            <p style="color: #555; font-size: 14px;">
                If you did not request a password reset, please ignore this email.
            </p>
            <p style="color: #555; font-size: 14px;">
                Thank you,<br>
                The AirMailGo Support Team
            </p>
        </div>
    `,
        });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Reset link has been sent to your email!",
        });

    } catch (error) {
        console.error("Error occurred!", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Something went wrong!",
            error: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};

export default forgotPassword;