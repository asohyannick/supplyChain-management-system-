import express from 'express';
import authenticationToken from '../../middleware/authentication/authenToken';
import sentReview from '../../services/review/sentReview/sentReview';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { reviewValidationSchema  } from '../../utils/validator';
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
router.post('/submit-review', authenticationToken, globalValidator(reviewValidationSchema), sentReview);
export default router;