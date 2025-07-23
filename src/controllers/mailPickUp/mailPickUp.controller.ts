import express from 'express'; // Import the express library for creating the router
import authenticationToken from '../../middleware/authentication/authenToken'; // Middleware for token-based authentication
import globalValidator from '../../middleware/globalValidator/globalValidator'; // Middleware for validating request data
import { mailPickUpSchema, updateMailPickUpSchema } from '../../utils/validator'; // Import the schema for validating pickup requests
import createMailPickUp from '../../services/mailPickUpService/createMailPickUp/createMailPickUp'; // Import the service to handle pickup creation
import showMailPickUps from '../../services/mailPickUpService/showMailPickUps/showMailPickUps';
import showMailPickUp from '../../services/mailPickUpService/showMailPickUp/showMailPickUp';
import updateMailPickUp from '../../services/mailPickUpService/updateMailPickUp/updateMailPickUp';

const router = express.Router(); // Create an instance of an Express router

/**
 * @swagger
 * tags:
 *   name: MailPickup
 *   description: Operations related to mail pickups
 */

/**
 * @swagger
 * path:
 *   /api/v1/mail-pickup/create-pickup:
 *     post:
 *       tags: [MailPickup]
 *       summary: Create a new mail pickup
 *       description: Endpoint for creating a new mail pickup request.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MailPickup'
 *       responses:
 *         201:
 *           description: Pickup request created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   message:
 *                     type: string
 *                     example: "Your pickup request has been successfully created."
 *                   pickupDetails:
 *                     $ref: '#/components/schemas/MailPickup'
 *         400:
 *           description: Invalid request data
 *         500:
 *           description: Internal Server Error
 */

router.post(
    '/create-pickup',
    globalValidator(mailPickUpSchema), 
    authenticationToken, 
    createMailPickUp 
);
router.get('/show-pickups', authenticationToken, showMailPickUps);
router.get('/show-pickup/:id', authenticationToken, showMailPickUp);
router.put('/update-pickup/:id', authenticationToken, globalValidator(updateMailPickUpSchema), updateMailPickUp);
export default router;