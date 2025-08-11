import express from 'express';
import register from '../../services/biometric/register/register';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import authenticationToken from '../../middleware/authentication/authenToken'; 
import { biometricDataSchema } from '../../utils/validator';
import authorizeRoles from '../../middleware/roleBasedAccessControlAuthentication/roleBasedAccessControlAuthenticationToken';
import { UserStatus } from '../../enums/user/user.constants';
const router = express.Router();
/**
 * @swagger
 * /api/v1/biometric/register:
 *   post:
 *     summary: Register a new user with biometric data
 *     description: This endpoint allows users to register by providing their biometric data.
 *     security:
 *       - bearerAuth: []  # Security scheme for authentication
 *     requestBody:
 *       required: true  # Indicates that the request body is mandatory
 *       content:
 *         application/json:  # Specifies the content type
 *           schema:
 *             $ref: '#/components/schemas/BiometricData'  # Reference to the BiometricData schema
 *     responses:
 *       '200':
 *         description: Registration successful  # Description of the successful response
 *         content:
 *           application/json:  # Content type of the response
 *             schema:
 *               type: object  # Response schema type
 *               properties:
 *                 message:
 *                   type: string  # Message indicating success
 *                   example: User registered successfully  # Example message
 *       '400':
 *         description: Bad Request  # Description of the error response
 *         content:
 *           application/json:  # Content type of the error response
 *             schema:
 *               type: object  # Schema type for the error response
 *               properties:
 *                 error:
 *                   type: string  # Error message type
 *                   example: Invalid biometric data  # Example error message
 */

router.post('/register', 
    authenticationToken,  // Middleware for authentication
    authorizeRoles(UserStatus.USER),  // Middleware for role-based access control
    globalValidator(biometricDataSchema),  // Middleware for validating request body
    register  // Service for handling registration
);

export default router;