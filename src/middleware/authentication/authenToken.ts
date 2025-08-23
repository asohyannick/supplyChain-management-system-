import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserStatus } from "../../enums/user/user.constants";
import User from '../../models/user/user.model';
interface CustomJWTPayload extends JwtPayload {
    userId: string;
    isAdmin: boolean;
    role: UserStatus; 
}
const authenticationToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['auth'];
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Access Denied!" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as CustomJWTPayload;
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not found!" });
        }
        req.user = user; 
        next(); 
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Access Denied!" });
    }
};

export default authenticationToken;