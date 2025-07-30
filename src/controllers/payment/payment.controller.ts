import express from 'express';
import authenticationToken from '../../middleware/authentication/authenToken';
import { processStripePayment } from '../../services/payment/processStripePayment/processStripePayment';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { stripePaymentSchema } from '../../utils/validator';
const router = express.Router();
router.post('/create-payment', authenticationToken, globalValidator(stripePaymentSchema), processStripePayment);
export default router;