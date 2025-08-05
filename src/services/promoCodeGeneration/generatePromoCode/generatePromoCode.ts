import { Request, Response } from 'express';
import { PromoCodeGenerationConstants } from '../../../enums/promoCodeGeneration/promoCodeGeneration.constants';
import PromoCode from '../../../models/promoCodeGeneration/promoCodeGeneration.model';
import { StatusCodes } from 'http-status-codes';
const generatePromoCode = async(req: Request, res: Response): Promise<Response> => {
    try {
        const { code, discountType, discountValue, expirationDate, requestedBy } = req.body; 
            const newPromoCode = new PromoCode({
            code,
            discountType: discountType || PromoCodeGenerationConstants.PERCENTAGE,
            discountValue,
            expirationDate,
            requestedBy,
            isActive: true,
        });
        await newPromoCode.save();
        return res.status(StatusCodes.CREATED).json({
            message: 'Promo code generated successfully',
            promoCode: newPromoCode,
        });
    } catch (error) {
        console.error('Error generating promo code:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error while generating promo code',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export default generatePromoCode;