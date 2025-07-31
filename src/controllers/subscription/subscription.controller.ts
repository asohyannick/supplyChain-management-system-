import express from 'express';
import createSubscription from '../../services/subscription/createSubscription/createSubscription';
import authenticationToken from '../../middleware/authentication/authenToken';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { subscriptionSchema } from '../../utils/validator';
const router = express.Router();
router.post('/create-subscription',authenticationToken, globalValidator(subscriptionSchema), createSubscription);
export default router;
