import express from 'express';
import register from '../../services/biometric/register/register';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import authenticationToken from '../../middleware/authentication/authenToken'; 
import { biometricDataSchema } from '../../utils/validator';
const router = express.Router();
router.post('/register', authenticationToken, globalValidator(biometricDataSchema), register);
export default router;