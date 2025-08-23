import { Request, Response } from "express";
import Review from "../../../models/review/review.model";
import { StatusCodes } from "http-status-codes";
const sentReview = async(req: Request, res: Response): Promise<Response> => {
    const { 
            firstName,
            lastName,
            email,
            feature,
            usabilityRating,
            message,
    } = req.body;
    try {
        const newReview = new Review({
            firstName,
            lastName,
            email,
            feature,
            usabilityRating,
            message,
            date: Date.now(),
        });
        await newReview.save();
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Your review has been submitted successfully",
            data: newReview,
        });
    } catch (error) {
        console.error("Error occured!", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error instanceof Error ? error.message : "Unknown Error Message",
        });
    }
}

export default sentReview;