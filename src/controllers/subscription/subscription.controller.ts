import express from 'express';
import createSubscription from '../../services/subscription/createSubscription/createSubscription';
import authenticationToken from '../../middleware/authentication/authenToken';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { pushNotificationSchema, subscriptionSchema, updateSubscriptionSchema } from '../../utils/validator';
import pushNotification from '../../services/subscription/pushNotification/pushNotification';
import showSubscriptions from '../../services/subscription/showSubscriptions/showSubscriptions';
import showSubscription from '../../services/subscription/showSubscription/showSubscription';
import updateSubscription from '../../services/subscription/updateSubscription/updateSubscription';
import deleteSubscription from '../../services/subscription/deleteSubscription/deleteSubscription';
import authorizeRoles from '../../middleware/roleBasedAccessControlAuthentication/roleBasedAccessControlAuthenticationToken';
import { UserStatus } from '../../enums/user/user.constants';

const router = express.Router();

/**
 * @swagger
 * /api/v1/subscription/create-subscription:
 *   post:
 *     summary: Create a subscription
 *     description: This endpoint creates a new subscription for a user.
 *     tags: [Subscription Management Endpoints]
 *     security:
 *       - bearerAuth: []  # Security scheme for authentication
 *     requestBody:
 *       required: true  # Indicates that the request body is mandatory
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'  # Reference to the Subscription schema
 *     responses:
 *       '201':
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription created successfully
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid subscription data
 */

router.post('/create-subscription',
    authenticationToken,  // Middleware for authentication
    authorizeRoles(UserStatus.USER),  // Middleware for role-based access control
    globalValidator(subscriptionSchema),  // Middleware for validating the request body
    createSubscription  // Service for creating the subscription
);

/**
 * @swagger
 * /api/v1/subscription/push-notification:
 *   post:
 *     summary: Send push notification
 *     description: This endpoint sends a push notification to subscribed users.
 *     tags: [Subscription Management Endpoints]
 *     security:
 *       - bearerAuth: []  # Security scheme for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PushNotification'  # Reference to the push notification schema
 *     responses:
 *       '200':
 *         description: Notification sent successfully
 *       '400':
 *         description: Bad Request
 */

router.post('/push-notification', 
    authenticationToken,
    authorizeRoles(UserStatus.USER),
    globalValidator(pushNotificationSchema),  // Middleware for validating the request body
    pushNotification  // Service for sending the push notification
);

/**
 * @swagger
 * /api/v1/subscription/show-subscriptions:
 *   get:
 *     summary: Show all subscriptions
 *     description: This endpoint retrieves all subscriptions for the authenticated user.
 *     tags: [Subscription Management Endpoints]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of subscriptions retrieved successfully
 *       '403':
 *         description: Forbidden
 */

router.get('/show-subscriptions', 
    authenticationToken,
    authorizeRoles(UserStatus.USER),
    showSubscriptions  // Service for showing all subscriptions
);

/**
 * @swagger
 * /api/v1/subscription/show-subscription/{id}:
 *   get:
 *     summary: Show a specific subscription
 *     description: This endpoint retrieves details of a specific subscription.
 *     tags: [Subscription Management Endpoints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the subscription to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Subscription details retrieved successfully
 *       '404':
 *         description: Subscription not found
 */

router.get('/show-subscription/:id', 
    authenticationToken,
    authorizeRoles(UserStatus.USER),
    showSubscription  // Service for showing a specific subscription
);

/**
 * @swagger
 * /api/v1/subscription/update-subscription/{id}:
 *   put:
 *     summary: Update a subscription
 *     description: This endpoint updates a specified subscription.
 *     tags: [Subscription Management Endpoints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the subscription to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'  # Reference to the Subscription schema
 *     responses:
 *       '200':
 *         description: Subscription updated successfully
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Subscription not found
 */

router.put('/update-subscription/:id', 
    authenticationToken, 
    authorizeRoles(UserStatus.USER),
    globalValidator(updateSubscriptionSchema),  // Middleware for validating the updated subscription
    updateSubscription  // Service for updating the subscription
); 

/**
 * @swagger
 * /api/v1/subscription/delete-subscription/{id}:
 *   delete:
 *     summary: Delete a subscription
 *     description: This endpoint deletes a specified subscription.
 *     tags: [Subscription Management Endpoints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the subscription to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Subscription deleted successfully
 *       '404':
 *         description: Subscription not found
 */

router.delete('/delete-subscription/:id', 
    authenticationToken, 
    authorizeRoles(UserStatus.USER),
    deleteSubscription  // Service for deleting the subscription
);

export default router;