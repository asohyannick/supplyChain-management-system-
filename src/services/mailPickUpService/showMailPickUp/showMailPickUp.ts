import MailPickUp from "../../../models/mailPickUp/mailPickUp";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const showMailPickUp = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const pickup = await MailPickUp.findById(id);
        if (!pickup) {
            return res.status(StatusCodes.NOT_FOUND).json({ 
                success: false,
                message: "Pickup doesn't exist!",
            })
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Your pickup has been fetched successfully",
            pickup,
        });
    } catch (error) {
        console.error("An error occurred while creating the pickup:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "We encountered an error while processing your request. Please try again later.",
            error: error instanceof Error ? error.message : "An unexpected error occurred.",
        });
    }
};

export default showMailPickUp;