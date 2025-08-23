import { Schema, model } from "mongoose";
import { DroneStatus } from "../../enums/drone/drone.constants";
import { UserStatus } from "../../enums/user/user.constants";
import { IUserProfile } from "../../serviceImplementators/profile/profile.interface";
import bcrypt from 'bcryptjs';
const userProfileSchema = new Schema<IUserProfile>({
    userId: { type: Schema.ObjectId, },
    firstName: { type: String, },
    lastName: { type: String, },
    email: { type: String, },
    password: { type: String,  },
    role: { type: String, enum: Object.values(UserStatus), default: UserStatus.USER },
    profilePicture: { type: String, ref:'User' },
    bio: { type: String, default: "" },
    drones: [{
        droneId: { type: String },
        status: { type: String, enum: Object.values(DroneStatus), default: DroneStatus.OFFLINE },
        pickupTime: { type: Date, default: Date.now },
        distance: { type: Number,  },
        location: {
            latitude: { type: Number,  },
            longitude: { type: Number,  },
        },
        address: {
            street: { type: String,  },
            city: { type: String,  },
            state: { type: String, },
            zipCode: { type: String,  },
            country: { type: String, },
        },
        notes: { type: String,  },
        packageDetails: [{
            weight: { type: Number, },
            dimensions: {
                length: { type: Number,  },
                width: { type: Number, },
                height: { type: Number,  },
            },
            description: { type: String, },
        }],
        batteryLevel: { type: Number },
    }],
}, { timestamps: true });
userProfileSchema.pre<IUserProfile>('save', async function (next) {
   if(!this.isModified('password')) return next;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
const UserProfile = model<IUserProfile>('UserProfile', userProfileSchema);
export default UserProfile;