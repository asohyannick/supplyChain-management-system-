import { Schema, model } from "mongoose";
import { PromoCodeGenerationConstants } from "../../enums/promoCodeGeneration/promoCodeGeneration.constants";
import { IPromoCodeGeneration } from '../../serviceImplementators/promoCodeGeneration/promoCodeGeneration.interfac';
const promoCodeSchema: Schema = new Schema<IPromoCodeGeneration>({
code:{
    type: String,
    unique: true,
},
discountType:{
    type: String,
    enum:Object.values(PromoCodeGenerationConstants),
    default: PromoCodeGenerationConstants.PERCENTAGE, 
},
discountValue:{
    type:Number,
},
expirationDate: {
    type:Date,
    default: Date.now,
},
isActive:{
    type: Boolean,
    default: false,
},
requestedBy:{
    type:Schema.ObjectId,
    ref: 'User',
},
}, {timestamps: true});

const PromoCode = model<IPromoCodeGeneration>('PromoCode', promoCodeSchema);
export default PromoCode