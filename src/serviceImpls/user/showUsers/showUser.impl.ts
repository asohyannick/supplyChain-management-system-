import User from "../../../models/user/user.model";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const showUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Users have been fetched successfully!",
            users,
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

export default showUsers;