import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import User from "../../../models/user/user.model";
import bcrypt from 'bcryptjs';
const resetPassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { id: string };
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found!",
            });
        }

        // Hash the new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Password has been reset successfully!",
        });

    } catch (error) {
        console.error("Error occurred!", error);
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Invalid or expired token!",
        });
    }
};

export default resetPassword;