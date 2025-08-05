import { Request, Response } from 'express';
import { PromoCodeGenerationConstants } from '../../../enums/promoCodeGeneration/promoCodeGeneration.constants';
import PromoCode from '../../../models/promoCodeGeneration/promoCodeGeneration.model';
import { StatusCodes } from 'http-status-codes';
const applyPromoCode = async(req: Request, res: Response): Promise<Response> => {
        const { code, orderTotal } = req.body;
    try {
        const promoCode = await PromoCode.findOne({ code, isActive: true });
        if (!promoCode) {
            return res.status(StatusCodes.BAD_REQUEST).json({success: false, message: "Invalid or inactive promo code." });
        }
        const { discountType, discountValue } = promoCode;
        let discountAmount = 0;
        if (discountType === PromoCodeGenerationConstants.PERCENTAGE) {
            discountAmount = (orderTotal * discountValue) / 100;
        } else if (discountType === PromoCodeGenerationConstants.FIXED) {
            discountAmount = discountValue;
        }
        const finalAmount = orderTotal - discountAmount;
        return res.status(StatusCodes.OK).json({
            message: "Promo code applied successfully.",
            discountAmount,
            finalAmount,
        });
    } catch (error) {
        console.error('Error generating promo code:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error while generating promo code',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export default applyPromoCode;