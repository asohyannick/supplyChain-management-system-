import express from 'express';
import authenticationToken from '../../middleware/authentication/authenToken';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { stripePaymentSchema, updatedStripePaymentSchema } from '../../utils/validator';
import showStripePayment from '../../services/payment/showStripePayment/showStripePayment';
import showStripePayments from '../../services/payment/showStripePayments/showStripePayments';
import editAndUpdateStripePayment from '../../services/payment/updateStripePayment/updateStripePayment';
import deleteStripePayment from '../../services/payment/deleteStripePayment/deleteStripePayment';
import refundStripePayment from '../../services/payment/refundStripePayment/refundStripePayment';
import processStripePayment from '../../services/payment/processStripePayment/processStripePayment';
import authorizeRoles from '../../middleware/roleBasedAccessControlAuthentication/roleBasedAccessControlAuthenticationToken';
import { UserStatus } from '../../enums/user/user.constants';

const router = express.Router();

/**
 * @swagger
 * /api/v1/stripe-payment/create-payment:
 *   post:
 *     summary: Create a new payment
 *     description: This endpoint processes a new payment.
 *     tags: [Stripe Management Endpoints]
 *     security:
 *       - bearerAuth: []  # Security scheme for authentication
 *     requestBody:
 *       required: true  # Indicates that the request body is mandatory
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StripePayment'  # Reference to the StripePayment schema
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
 *                   example: Payment processed successfully
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

router.post('/create-payment', 
    authenticationToken,  // Middleware for authentication
    authorizeRoles(UserStatus.USER),  // Middleware for role-based access control
    globalValidator(stripePaymentSchema),  // Middleware for validating the request body
    processStripePayment  // Service for processing the payment
);

/**
 * @swagger
 * /api/v1/stripe-payment/refund-payment/{id}:
 *   post:
 *     summary: Refund a payment
 *     description: This endpoint refunds a specified payment.
 *     tags: [Stripe Management Endpoints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the payment to be refunded
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Payment refunded successfully
 *       '404':
 *         description: Payment not found
 */

router.post('/refund-payment/:id',
    authenticationToken,
    authorizeRoles(UserStatus.USER), 
    refundStripePayment  // Service for refunding the payment
);

/**
 * @swagger
 * /api/v1/stripe-payment/show-payments:
 *   get:
 *     summary: Retrieve all payments
 *     description: This endpoint retrieves a list of all payments.
 *     tags: [Stripe Management Endpoints]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of payments
 *       '403':
 *         description: Forbidden
 */

router.get('/show-payments', 
    authenticationToken,
    authorizeRoles(UserStatus.USER),
    showStripePayments  // Service for showing all payments
);

/**
 * @swagger
 * /api/v1/stripe-payment/show-payment/{id}:
 *   get:
 *     summary: Retrieve a specific payment
 *     description: This endpoint retrieves details of a specific payment.
 *     tags: [Stripe Management Endpoints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the payment to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Payment details retrieved successfully
 *       '404':
 *         description: Payment not found
 */

router.get('/show-payment/:id', 
    authenticationToken,
    authorizeRoles(UserStatus.USER),
    showStripePayment  // Service for showing a specific payment
);

/**
 * @swagger
 * /api/v1/stripe-payment/update-payment/{id}:
 *   put:
 *     summary: Update a payment
 *     description: This endpoint updates the details of a specified payment.
 *     tags: [Stripe Management Endpoints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the payment to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StripePayment'  # Reference to the updated payment schema
 *     responses:
 *       '200':
 *         description: Payment updated successfully
 *       '400':
 *         description: Bad Request
 */

router.put('/update-payment/:id',
    authenticationToken,
    authorizeRoles(UserStatus.USER),
    globalValidator(updatedStripePaymentSchema),  // Middleware for validating the updated payment
    editAndUpdateStripePayment  // Service for updating the payment
);

/**
 * @swagger
 * /api/v1/stripe-payment/delete-payment/{id}:
 *   delete:
 *     summary: Delete a payment
 *     description: This endpoint deletes a specified payment.
 *     tags: [Stripe Management Endpoints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the payment to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Payment deleted successfully
 *       '404':
 *         description: Payment not found
 */

router.delete('/delete-payment/:id', 
    authenticationToken,
    authorizeRoles(UserStatus.USER),
    deleteStripePayment  // Service for deleting the payment
);

export default router;