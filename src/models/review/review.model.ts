import { Schema, model } from "mongoose";
import { IReview } from "../../serviceImplementators/review/review.interface";
const reviewSchema: Schema = new Schema<IReview>({
 userId:{
    type:Schema.ObjectId,
    ref:'User',
 },
 firstName:{
    type:String,
 },
 lastName:{
   type:String,
},
email:{
   type:String,
   unique: true,
},
feature:{
    type:String,
},
date:{
    type:Date,
    default: Date.now,
},
usabilityRating:{
    type:String,
},
message:{
    type:String,
},
}, {timestamps: true});
const Review = model<IReview>('Review', reviewSchema);
export default Review;