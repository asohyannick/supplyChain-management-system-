import express from 'express';
import createAccount from '../../services/userService/createAccount/register.impls';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { updateUserValidationSchema, userLoginValidationSchema, userValidationSchema } from '../../utils/validator';
import signin from '../../services/userService/login/login.impls';
import userLogout from '../../services/userService/logout/logout.impl';
import showUsers from '../../services/userService/showUsers/showUser.impl';
import showUser from '../../services/userService/showUser/showUser.impl';
import updateUser from '../../services/userService/updateAccount/updateUser.impl';
import deleteUser from '../../services/userService/deleteAccount/deleteAccount.impl';
import requestAccessToken from '../../services/userService/refreshAccessToken/refreshAccessToken.impl';
import resetPassword from '../../services/userService/resetPassword/resetPassword.impl';
import forgotPassword from '../../services/userService/forgotPassword/forgotPassword.impl';
import firebaseLogin from '../../services/userService/firebaseAuth/firebaseLogin';
import { handleGeneratedGitHubAccessToken, redirectToGithubLogin } from '../../services/userService/gitHubAuth/gitHubAuthLogin';
import generateQRCode from '../../services/userService/generateQRCode/generateQRCode';
import authorizeRoles from '../../middleware/roleBasedAccessControlAuthentication/roleBasedAccessControlAuthenticationToken';
import { UserStatus } from '../../enums/user/user.constants';
const router = express.Router();
/**
 * @swagger
 * /api/v1/user/create-account:
 *   post:
 *     summary: Create a new user account
 *     tags: [User Management Endpoints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User account has been created successfully
 *       400:
 *         description: Validation error
 */
router.post('/create-account', globalValidator(userValidationSchema), createAccount);
/**
 * @swagger
 * /api/v1/user/generate-qr-code/{id}:
 *   get:
 *     summary: Generate a QR code for a user
 *     tags: [User Management Endpoints]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user for whom to generate the QR code.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: QR code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "QR code generated successfully."
 *                 qrCodeUrl:
 *                   type: string
 *                   example: "http://example.com/path/to/qr-code.png"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Something went wrong!"
 */
router.get('/generate-qr-code/:id', generateQRCode);

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: User login
 *     tags: [User Management Endpoints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', globalValidator(userLoginValidationSchema), signin);

/**
 * @swagger
 * /api/v1/user/logout:
 *   post:
 *     summary: User logout
 *     tags: [User Management Endpoints]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', userLogout);

/**
 * @swagger
 * /api/v1/user/request-access-token:
 *   post:
 *     summary: Request access token
 *     tags: [User Management Endpoints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to request a new access token
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accessToken:
 *                   type: string
 *                   description: New access token issued
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Invalid refresh token
 *       401:
 *         description: Unauthorized - refresh token is expired or invalid
 */
router.post('/request-access-token', requestAccessToken);

/**
 * @swagger
 * /api/v1/user/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [User Management Endpoints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user requesting password reset
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Invalid email address
 *       404:
 *         description: User not found with the provided email address
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/v1/user/firebase-login:
 *   post:
 *     summary: Firebase login
 *     tags: [User Management Endpoints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: The ID token provided by Firebase for user authentication
 *             required:
 *               - idToken
 *     responses:
 *       200:
 *         description: Firebase login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accessToken:
 *                   type: string
 *                   description: Access token issued for the logged-in user
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Invalid ID token
 *       401:
 *         description: Unauthorized - invalid credentials
 */
router.post('/firebase-login', firebaseLogin);

/**
 * @swagger
 * /api/v1/user/auth/github:
 *   get:
 *     summary: Redirect to GitHub for authentication
 *     tags: [User Management Endpoints]
 *     responses:
 *       302:
 *         description: Redirected to GitHub
 */
router.get('/auth/github', redirectToGithubLogin);

/**
 * @swagger
 * /api/v1/user/auth/github/callback:
 *   get:
 *     summary: Handle GitHub callback
 *     tags: [User Management Endpoints]
 *     responses:
 *       200:
 *         description: GitHub access token received
 */
router.get('/auth/github/callback', handleGeneratedGitHubAccessToken);

/**
 * @swagger
 * /api/v1/user/reset-password/{token}:
 *   post:
 *     summary: Reset user password
 *     tags: [User Management Endpoints]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: Password reset token
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user
 *                 minLength: 6
 *             required:
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Invalid token or password
 *       404:
 *         description: User not found or token expired
 */
router.post('/reset-password/:token', resetPassword);

/**
 * @swagger
 * /api/v1/user/show-users:
 *   get:
 *     summary: Retrieve all users from the backend and database management system
 *     tags: [User Management Endpoints]
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get('/show-users', authorizeRoles(UserStatus.ADMIN), showUsers);

/**
 * @swagger
 * /api/v1/user/show-user/{id}:
 *   get:
 *     summary: Retrieve a user by ID from the database management system
 *     tags: [User Management Endpoints]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/show-user/:id',authorizeRoles(UserStatus.ADMIN), showUser);

/**
 * @swagger
 * /api/v1/user/update-account/{id}:
 *   put:
 *     summary: Update user account by user ID
 *     tags: [User Management Endpoints]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 */
router.put('/update-account/:id', globalValidator(updateUserValidationSchema), updateUser);

/**
 * @swagger
 * /api/v1/user/delete-account/{id}:
 *   delete:
 *     summary: Delete a user account by his or her account ID.
 *     tags: [User Management Endpoints]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User account has been deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/delete-account/:id', deleteUser);
export default router;