import Subscription from "../../../models/subscription/subscription.model";
import { Request, Response } from 'express';
import { StatusCodes } from "http-status-codes"; 
const showSubscriptions = async (_req: Request, res: Response): Promise<Response> => {
    try {
       const subscriptions = await Subscription.find();
        return res.status(StatusCodes.OK).json({ message: "Subscriptions have been fetched successfully.", subscription: subscriptions});
    }   
    catch (error) { 
        console.error("Error creating subscription:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while creating the subscription." });
    }   
};  
 export default showSubscriptions;