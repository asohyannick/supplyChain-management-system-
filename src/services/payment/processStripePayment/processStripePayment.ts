import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import 'dotenv/config';
import StripePayment from '../../../models/payment/payment.model';
import { PaymentStatus } from '../../../enums/stripe/stripe.constants';

const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY as string, {
    apiVersion: '2025-06-30.basil',
});

const processStripePayment = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { amount, currency } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card'],
        });
        // Check payment status
        if (paymentIntent.status === 'succeeded') {
            const payment = new StripePayment({
                paymentIntentId: paymentIntent.id,
                amount,
                currency,
                status: PaymentStatus.SUCCESS,
                lastUpdated: Date.now(),
            });
            await payment.save();

            return res.status(StatusCodes.CREATED).json({
                success: true,
                status: PaymentStatus.SUCCESS,
                message: "Stripe payment successful",
                clientSecret: paymentIntent.client_secret,
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Payment not completed successfully.",
                paymentStatus: paymentIntent.status,
            });
        }
    } catch (error) {
        console.error("Error occurred while processing payment with Stripe:", error);
        if (error instanceof Stripe.errors.StripeError) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                success: false,
                message: error instanceof Error ? error.message : "Unknown Error",
            });
        }
        if (error instanceof mongoose.Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                success: false,
                message: error instanceof Error ? error.message : "Unknown Error",
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error",
        });
    }
};

export default processStripePayment;