import Subscription from "../../../models/subscription/subscription.model";
import { Request, Response } from 'express';
import { StatusCodes } from "http-status-codes";
import * as webPush from 'web-push';
const vapidKeys = {
    public_key: process.env.VAPID_PUBLIC_KEY as string,
    private_key: process.env.VAPID_PRIVATE_KEY as string,
};
webPush.setVapidDetails(
  'mailto:your-email@example.com',
    vapidKeys.public_key,
    vapidKeys.private_key,
);  
const createSubscription = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId, subscription } = req.body;
        if (!userId || !subscription) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User ID and subscription data are required." });
        }   
        const newSubscription = new Subscription({
            userId,
            subscription    
        });
        await newSubscription.save();
        return res.status(StatusCodes.CREATED).json({ message: "Subscription created successfully.", subscription: newSubscription });
    }   
    catch (error) { 
        console.error("Error creating subscription:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while creating the subscription." });
    }   
};  
 export default createSubscription;