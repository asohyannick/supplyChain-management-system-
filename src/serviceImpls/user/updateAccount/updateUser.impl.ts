import User from "../../../models/user/user.model";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            firstName,
            lastName,
            email,
            password,
        } = req.body;
        const user = await User.findByIdAndUpdate(id, {
            firstName,
            lastName,
            email,
            password,
            isAdmin: true,
        }, { new: true, runValidators: true });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User doesn't exist" });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "User has been updated successfully from the database management system!",
            user,
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

export default updateUser;