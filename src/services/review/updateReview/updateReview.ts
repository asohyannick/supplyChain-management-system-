import { Request, Response } from "express";
import Review from "../../../models/review/review.model";
import { StatusCodes } from "http-status-codes";
const updateReview = async(req: Request, res: Response): Promise<Response> => {
    const { 
        firstName,
        lastName,
        email,
        feature,
        usabilityRating,
        message,
    } = req.body;
    const { id } = req.params;
    try {
        const review = await Review.findByIdAndUpdate(id, {
            firstName,
            lastName,
            email,
            feature,
            date: Date.now(),
            usabilityRating,
            message,
        }, { new: true, runValidators: true});
        if (!review) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Review doesn't exist!",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Your review has been updated successfully",
            data: review,
        });
    } catch (error) {
        console.error("Error occured!", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error instanceof Error ? error.message : "Unknown Error Message",
        });
    }
}

export default updateReview;