import express from 'express';
import authenticationToken from '../../middleware/authentication/authenToken';
import generatePromoCode from '../../services/promoCodeGeneration/generatePromoCode/generatePromoCode';
import globalValidator from '../../middleware/globalValidator/globalValidator';
import { promoCodeValidationSchema } from '../../utils/validator';
import applyPromoCode from '../../services/promoCodeGeneration/applyPromoCode/applyPromoCode';
import authorizeRoles from '../../middleware/roleBasedAccessControlAuthentication/roleBasedAccessControlAuthenticationToken';
import { UserStatus } from '../../enums/user/user.constants';
const router = express.Router();
// POST /generate-promo-code endpoint
/**
 * @swagger
 * /api/v1/promode-code/generate:
 *   post:
 *     summary: Generate a promo code
 *     tags: [PromoCode Management Endpoints]
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
router.post('/generate', 
    authenticationToken,
    authorizeRoles(UserStatus.ADMIN),
    globalValidator(promoCodeValidationSchema),
    generatePromoCode
);
/**
 * @swagger
 * /api/v1/promo-code/apply:
 *   post:
 *     summary: Apply a promo code during checkout
 *     tags: [PromoCode Management Endpoints]
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               promoCode:
 *                 type: string
 *                 example: "PROMO123"
 *               orderId:
 *                 type: string
 *                 example: "607f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Promo code applied successfully
 *       400:
 *         description: Invalid promo code or request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Promo code not found
 *       500:
 *         description: Internal server error
 */
router.post('/apply', 
    authenticationToken,
    authorizeRoles(UserStatus.USER),
    applyPromoCode
);
export default router;