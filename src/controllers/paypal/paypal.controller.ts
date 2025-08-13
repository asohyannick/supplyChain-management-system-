import express from "express";
import globalValidator from "../../middleware/globalValidator/globalValidator";
import authenticationToken from "../../middleware/authentication/authenToken";
import { createPayment, paymentSucceeded } from "../../services/paypalPayment/paypalPayment";
import { stripePaymentValidationSchema } from '../../utils/validator';
import authorizeRoles from "../../middleware/roleBasedAccessControlAuthentication/roleBasedAccessControlAuthenticationToken";
import { UserStatus } from "../../enums/user/user.constants";
const router = express.Router();
/**
 * @swagger
 * /api/v1/paypal-payment/create:
 *   post:
 *     summary: Create a PayPal payment
 *     description: This endpoint initiates a new PayPal payment.
 *     tags: [Paypal Management Endpoints]
 *     security:
 *       - bearerAuth: []  # Security scheme for authentication
 *     requestBody:
 *       required: true  # Indicates that the request body is mandatory
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PayPalTransaction'  # Reference to the PayPalTransaction schema
 *     responses:
 *       '200':
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment created successfully
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid payment data
 */

router.post("/create", 
    authenticationToken,  // Middleware for authentication
    authorizeRoles(UserStatus.USER),  // Middleware for role-based access control
    globalValidator(stripePaymentValidationSchema),  // Middleware for validating the request body
    createPayment  // Service for creating the payment
);

/**
 * @swagger
 * /api/v1/paypal-payment/success:
 *   get:
 *     summary: Handle successful PayPal payment
 *     description: This endpoint processes the successful completion of a PayPal payment.
 *     tags: [Paypal Management Endpoints]
 *     security:
 *       - bearerAuth: []  # Security scheme for authentication
 *     responses:
 *       '200':
 *         description: Payment succeeded
 *       '403':
 *         description: Forbidden
 */

router.get("/success", 
    authenticationToken,
    authorizeRoles(UserStatus.USER), 
    paymentSucceeded  // Service for handling successful payment
);

export default router;