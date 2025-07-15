import express from 'express';
import createAccount from '../../serviceImpls/user/register/register.impls';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { userValidationSchema } from '../../utils/validator';
const router = express.Router();
router.post('/create-account', globalValidator(userValidationSchema), createAccount);
export default router;