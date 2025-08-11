import express from 'express';
import authenticationToken from '../../middleware/authentication/authenToken';
import sentReview from '../../services/review/sentReview/sentReview';
import updateReview from '../../services/review/updateReview/updateReview';
import deleteReview from '../../services/review/deleteReview/deleteReview';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { reviewValidationSchema, updateReviewValidationSchema  } from '../../utils/validator';
import authorizeRoles from '../../middleware/roleBasedAccessControlAuthentication/roleBasedAccessControlAuthenticationToken';
import { UserStatus } from '../../enums/user/user.constants';
const router = express.Router();
/**
 * @swagger
 * /api/v1/review/submit-review:
 *   post:
 *     summary: Submit a review
 *     description: Endpoint to submit a review.
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         type: string
 *         description: Bearer token for authentication.
 *       - in: body
 *         name: review
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Review'
 *     responses:
 *       '200':
 *         description: Review submitted successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Review submitted successfully.'
 *       '400':
 *         description: Invalid input data.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Validation error.'
 *       '401':
 *         description: Unauthorized access.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Unauthorized.'
 */
router.post('/submit-review', 
    authenticationToken, 
    authorizeRoles(UserStatus.USER),
    globalValidator(reviewValidationSchema), 
    sentReview
);

/**
 * @swagger
 * /api/v1/review/update-review/{id}:
 *   put:
 *     summary: Update a review
 *     description: Endpoint to update an existing review by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the review to update.
 *       - name: Authorization
 *         in: header
 *         required: true
 *         type: string
 *         description: Bearer token for authentication.
 *       - in: body
 *         name: review
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Review'  # Reference to the Review definition
 *     responses:
 *       '200':
 *         description: Review updated successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Review updated successfully.'
 *       '400':
 *         description: Invalid input data.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Validation error.'
 *       '401':
 *         description: Unauthorized access.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Unauthorized.'
 *       '404':
 *         description: Review not found.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Review not found.'
 */
router.put('/update-review/:id',
    authenticationToken, 
    authorizeRoles(UserStatus.USER),
    globalValidator(updateReviewValidationSchema),
    updateReview
);
/**
 * @swagger
 * /api/v1/review/delete-review/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Endpoint to delete an existing review by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the review to delete.
 *       - name: Authorization
 *         in: header
 *         required: true
 *         type: string
 *         description: Bearer token for authentication.
 *     responses:
 *       '200':
 *         description: Review deleted successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Review deleted successfully.'
 *       '401':
 *         description: Unauthorized access.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Unauthorized.'
 *       '404':
 *         description: Review not found.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: 'Review not found.'
 */
router.delete('/delete-review/:id',
    authenticationToken,
    authorizeRoles(UserStatus.USER),
    deleteReview
);
export default router;