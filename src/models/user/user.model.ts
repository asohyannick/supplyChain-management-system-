import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';
import { IUser } from "../../services/userService/user.interfac";
const userSchema: Schema = new Schema<IUser>({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
        trim: true,
    },
}, { timestamps: true });
userSchema.pre<IUser>('save', async function (next) {
    if(!this.isModified('password')) return next;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
const User = model<IUser>('User', userSchema);
export default User;