import express from 'express';
import authenticationToken from '../../middleware/authentication/authenToken';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { userProfileValidationSchema } from '../../utils/validator';
import createUserProfile from '../../services/profile/createProfile/createProfile';
const router = express.Router();
router.post('/create-profile', authenticationToken, globalValidator(userProfileValidationSchema), createUserProfile);
export default router;