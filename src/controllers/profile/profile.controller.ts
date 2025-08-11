import express from 'express';
import authenticationToken from '../../middleware/authentication/authenToken';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { updateUserProfileValidationSchema, userProfileValidationSchema } from '../../utils/validator';
import createUserProfile from '../../services/profile/createProfile/createProfile';
import updateUserProfile from '../../services/profile/updateProfile/updateProfile';
import deleteUserProfile from '../../services/profile/deleteProfile/deleteProfile';
import authorizeRoles from '../../middleware/roleBasedAccessControlAuthentication/roleBasedAccessControlAuthenticationToken';
import { UserStatus } from '../../enums/user/user.constants';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         userId:
 *           type: string  # MongoDB ObjectId of the user
 *         profilePicture:
 *           type: string  # URL of the user's profile picture
 *         bio:
 *           type: string  # User's biography
 *         firstName:
 *           type: string  # User's first name
 *         lastName:
 *           type: string  # User's last name
 *         email:
 *           type: string  # User's email address
 *           format: email  # Format for email validation
 *         password:
 *           type: string  # User's password
 *         role:
 *           type: string  # User's role
 *           enum: ['Admin', 'Dispatcher', 'Drone Operator', 'User']  # Allowed roles
 *         drones:
 *           type: array  # List of drones associated with the user
 *           items:
 *             type: object
 *             properties:
 *               droneId:
 *                 type: string  # Unique identifier for the drone
 *               status:
 *                 type: string  # Current status of the drone
 *                 enum: Object.values(DroneStatus)  # Allowed statuses
 *               pickupTime:
 *                 type: string  # Scheduled pickup time
 *                 format: date-time  # Format for the date-time
 *               distance:
 *                 type: number  # Distance for the delivery
 *               location:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number  # Latitude of the location
 *                   longitude:
 *                     type: number  # Longitude of the location
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string  # Street address
 *                   city:
 *                     type: string  # City name
 *                   state:
 *                     type: string  # State name
 *                   zipCode:
 *                     type: string  # ZIP code
 *                   country:
 *                     type: string  # Country name
 *               notes:
 *                 type: string  # Additional notes
 *               packageDetails:
 *                 type: array  # Details about packages
 *                 items:
 *                   type: object
 *                   properties:
 *                     weight:
 *                       type: number  # Weight of the package
 *                     dimensions:
 *                       type: object
 *                       properties:
 *                         length:
 *                           type: number  # Length of the package
 *                         width:
 *                           type: number  # Width of the package
 *                         height:
 *                           type: number  # Height of the package
 *                     description:
 *                       type: string  # Description of the package
 *               batteryLevel:
 *                 type: number  # Battery level of the drone
 *       required:
 *         - userId  # Required field for user ID
 *         - firstName  # Required field for first name
 *         - lastName  # Required field for last name
 *         - email  # Required field for email
 *         - password  # Required field for password
 *         - role  # Required field for role
 *         - drones  # Required field for drones
 */

/**
 * @swagger
 * /api/v1/profile/create-profile:
 *   post:
 *     summary: Create a user profile
 *     description: This endpoint creates a new user profile.
 *     security:
 *       - bearerAuth: []  # Security scheme for authentication
 *     requestBody:
 *       required: true  # Indicates that the request body is mandatory
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'  # Reference to the Profile schema
 *     responses:
 *       '201':
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile created successfully
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid profile data
 */

router.post('/create-profile', 
    authenticationToken,  // Middleware for authentication
    authorizeRoles(UserStatus.USER),  // Middleware for role-based access control
    globalValidator(userProfileValidationSchema),  // Middleware for validating the request body
    createUserProfile  // Service for creating the user profile
);

/**
 * @swagger
 * /api/v1/profile/update-profile/{id}:
 *   put:
 *     summary: Update a user profile
 *     description: This endpoint updates an existing user profile.
 *     security:
 *       - bearerAuth: []  # Security scheme for authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the profile to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'  # Reference to the Profile schema
 *     responses:
 *       '200':
 *         description: Profile updated successfully
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Profile not found
 */

router.put('/update-profile/:id', 
    authenticationToken, 
    authorizeRoles(UserStatus.USER),
    globalValidator(updateUserProfileValidationSchema),  // Middleware for validating the updated profile
    updateUserProfile  // Service for updating the user profile
);

/**
 * @swagger
 * /api/v1/profile/delete-profile/{id}:
 *   delete:
 *     summary: Delete a user profile
 *     description: This endpoint deletes a specified user profile.
 *     security:
 *       - bearerAuth: []  # Security scheme for authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the profile to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Profile deleted successfully
 *       '404':
 *         description: Profile not found
 */

router.delete('/delete-profile/:id',
    authenticationToken, 
    authorizeRoles(UserStatus.USER),
    deleteUserProfile  // Service for deleting the user profile
);

export default router;