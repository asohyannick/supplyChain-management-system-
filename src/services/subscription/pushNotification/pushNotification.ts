import webPush from 'web-push';
import 'dotenv/config';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Subscription from '../../../models/subscription/subscription.model';
const vapidKeys = {
    public_key: process.env.VAPID_PUBLIC_KEY as string,
    private_key: process.env.VAPID_PRIVATE_KEY as string,
};
webPush.setVapidDetails(
    'mailto:your-email@example.com',
    vapidKeys.public_key,
    vapidKeys.private_key,
);
const sendNotification = async (title: string, body: string, image: string): Promise<void> => {
    const subscriptions = await Subscription.find({});
    if (!subscriptions || subscriptions.length === 0) {
        console.warn('No subscriptions found for push notifications.');
        return;
    }
    subscriptions.forEach((subscription) => {
        const sub = {
            endpoint: subscription.endpoint,
            keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth
            }
        };
        const payload = JSON.stringify({
            notification: {
                title,
                body,
                image,
            },
        });
        webPush.sendNotification(sub, payload)
            .catch(error => console.error('Error sending notification:', error));
    });
};
const pushNotification = async (req: Request, res: Response) => {
    try {
        const { title, body, image } = req.body;
        await sendNotification(title, body, image);
        res.status(StatusCodes.OK).json({ success: true, message: 'Notification sent successfully.' });
    } catch (error) {
        console.error("Error creating subscription:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while creating the subscription."
        });
    }
};

export default pushNotification;

