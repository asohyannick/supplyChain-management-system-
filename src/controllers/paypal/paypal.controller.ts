import express from "express";
import globalValidator from "../../middleware/globalValidator/globalValidator";
import authenticationToken from "../../middleware/authentication/authenToken";
import { createPayment, paymentSucceeded } from "../../services/paypalPayment/paypalPayment";
import { stripePaymentValidationSchema } from '../../utils/validator';
const router = express.Router();
// Route to create a PayPal payment
router.post("/create", authenticationToken, globalValidator(stripePaymentValidationSchema), createPayment);
// Route to handle successful PayPal payment
router.get("/success", authenticationToken, paymentSucceeded);
export default router