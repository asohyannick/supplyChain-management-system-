import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import StripePayment from '../../../models/payment/payment.model';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import { PaymentStatus } from '../../../enums/stripe/stripe.constants';
const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY as string, {
    apiVersion: '2025-06-30.basil',
});
const refundStripePayment = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const payment = await StripePayment.findById(id);
        if (!payment) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Payment doesn't exist!" })
        }
        if (payment.status === PaymentStatus.REFUNDED) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Payment already refunded" });
        }
        const paymentIntent = await stripe.paymentIntents.retrieve(payment.paymentIntentId);
        console.log("PaymentIntent:", paymentIntent);
        if (paymentIntent.status === 'succeeded') {
            // Proceed with refund logic
            const refund = await stripe.refunds.create({
                payment_intent: payment.paymentIntentId,
            });

            // Update payment status in the database
            payment.status = PaymentStatus.REFUNDED;
            await payment.save();
            return res.status(StatusCodes.OK).json({ message: "Payment has been refunded successfully", refund });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Payment has not been successfully completed.", status: paymentIntent.status });
        }
    } catch (error) {
        console.error("Error occurred while processing payment with Stripe:", error);

        // Check if error is an instance of Stripe's APIError
        if (error instanceof Stripe.errors.StripeError) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }

        // Handle MongoDB errors
        if (error instanceof mongoose.Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error saving payment to database." });
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

export default refundStripePayment
