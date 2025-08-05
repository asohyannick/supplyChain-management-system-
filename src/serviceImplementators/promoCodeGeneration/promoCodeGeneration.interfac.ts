import { Document, Types } from "mongoose";
import { PromoCodeGenerationConstants } from "../../enums/promoCodeGeneration/promoCodeGeneration.constants";
export interface IPromoCodeGeneration extends Document {
    _id: Types.ObjectId;
    code: string;
    discountType:PromoCodeGenerationConstants;
    discountValue: number;
    expirationDate?: Date;
    isActive: boolean;
    requestedBy?: Types.ObjectId;
}