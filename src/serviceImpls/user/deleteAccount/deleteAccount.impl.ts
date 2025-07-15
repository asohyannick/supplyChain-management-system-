import User from "../../../models/user/user.model";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User doesn't exist" });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "User has been deleted successfully from the database management system!",
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

export default deleteUser;