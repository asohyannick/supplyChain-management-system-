import MailPickUp from "../../../models/mailPickUp/mailPickUp";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const showMailPickUps = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const pickups = await MailPickUp.find();
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Your pickups have been fetched successfully",
            pickupDetails: pickups,
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

export default showMailPickUps;