import Subscription from "../../../models/subscription/subscription.model";
import { Request, Response } from 'express';
import { StatusCodes } from "http-status-codes"; 
const updateSubscription = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId, subscription } = req.body;
       const { id } = req.params;
       const subscriptionMsg = await Subscription.findByIdAndUpdate(id, {userId, subscription}, { new: true , runValidators: true });
       if(!subscriptionMsg) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: "Subscription not found." });
       }
        return res.status(StatusCodes.OK).json({ message: "Subscription has been updated successfully.", data: subscriptionMsg});
    }   
    catch (error) { 
        console.error("Error creating subscription:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while creating the subscription." });
    }   
};  
export default updateSubscription;