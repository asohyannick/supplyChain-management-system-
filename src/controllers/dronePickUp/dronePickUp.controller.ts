import express from 'express'; // Import the express library for creating the router
import authenticationToken from '../../middleware/authentication/authenToken'; // Middleware for token-based authentication
import globalValidator from '../../middleware/globalValidator/globalValidator'; // Middleware for validating request data
import { dronePickUpSchema, updateDronePickUpSchema, } from '../../utils/validator'; // Import the schema for validating pickup requests
import createDronePickUp from '../../services/dronePickUpService/createDronePickUp/createDronePickUp'; // Import the service to handle pickup creation
import showDronePickUps from '../../services/dronePickUpService/showDronePickUps/showDronePickUps';
import showDronePickUp from '../../services/dronePickUpService/showDronePickUp/showDronePickUp';
import updateDronePickUp from '../../services/dronePickUpService/updateDronePickUp/updateDronePickUp';
import deleteDronePickUp from '../../services/dronePickUpService/deleteDronePickUp/deleteDronePickUp';
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
 *       summary: Create a new drone pickup
 *       description: Endpoint for creating a new drone pickup request.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DronePickup'
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
 *                     $ref: '#/components/schemas/DronePickup'
 *         400:
 *           description: Invalid request data
 *         500:
 *           description: Internal Server Error
 */

router.post(
    '/create-pickup',
    globalValidator(dronePickUpSchema),
    authenticationToken,
    createDronePickUp
);
router.get('/show-pickups', authenticationToken, showDronePickUps);
router.get('/show-pickup/:id', authenticationToken, showDronePickUp);
router.put('/update-pickup/:id', authenticationToken, globalValidator(updateDronePickUpSchema), updateDronePickUp);
router.delete('/delete-pickup/:id', authenticationToken, deleteDronePickUp);
export default router;