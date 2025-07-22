import MailPickUp from "../../../models/mailPickUp/mailPickUp";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const createMailPickUp = async (req: Request, res: Response): Promise<Response> => {
    const {
        address,
        notes,
        packageDetails,
    } = req.body;

    try {
        const newMailPickUp = new MailPickUp({
            pickupTime: Date.now(),
            address,
            notes,
            packageDetails,
        });
        
        await newMailPickUp.save();

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Your pickup request has been successfully created.",
            pickupDetails: newMailPickUp,
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

export default createMailPickUp;