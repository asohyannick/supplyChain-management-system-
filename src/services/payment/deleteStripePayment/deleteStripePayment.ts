import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import StripePayment from '../../../models/payment/payment.model';
const deleteStripePayment = async(req: Request, res: Response): Promise<Response> => {
    try {
        const { id }  = req.params;
        const payment = await StripePayment.findByIdAndDelete(id);
        if (!payment) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Payment doesn't exist!"});
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Stripe payment has been deleted esuccessfully",
            payment
        });
    } catch (error) {
        console.error("Error occurred while processing payment with Stripe:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
    }
};

export default deleteStripePayment;
