import express from 'express';
import authenticationToken from '../../middleware/authentication/authenToken';
import generatePromoCode from '../../services/promoCodeGeneration/generatePromoCode/generatePromoCode';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { promoCodeValidationSchema } from '../../utils/validator';
const router = express.Router();
// POST /generate-promo-code endpoint
/**
 * @swagger
 * /api/v1/promode-code/generate-promo-code:
 *   post:
 *     summary: Generate a promo code
 *     tags: [Promo Codes]
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "PROMO123"
 *               discountType:
 *                 type: string
 *                 enum: [PERCENTAGE, FIXED]
 *                 example: "PERCENTAGE"
 *               discountValue:
 *                 type: number
 *                 example: 20
 *               expirationDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               requestedBy:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Promo code generated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/generate-promo-code', authenticationToken, globalValidator(promoCodeValidationSchema), generatePromoCode);
export default router;