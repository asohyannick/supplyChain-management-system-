import Subscription from "../../../models/subscription/subscription.model";
import { Request, Response } from 'express';
import { StatusCodes } from "http-status-codes"; 
const showSubscription = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
       const subscription = await Subscription.findById(id);
       if(!subscription) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: "Subscription not found." });
       }
        return res.status(StatusCodes.OK).json({ message: "Subscription has been fetched successfully.", data: subscription});
    }   
    catch (error) { 
        console.error("Error creating subscription:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while creating the subscription." });
    }   
};  
 export default showSubscription;