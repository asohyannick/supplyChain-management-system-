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
 * /api/v1/profile/create-profile:
 *   post:
 *     summary: Create a user profile
 *     description: This endpoint creates a new user profile.
 *     tags: [Profile Management Endpoints]
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
 *     tags: [Profile Management Endpoints]
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
 *     tags: [Profile Management Endpoints]
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