import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJWTPayload extends JwtPayload {
    id: string;
    userId: string;
    isAdmin: boolean;
}

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            user?: {
                id: string;
                isAdmin: boolean;
            };
        }
    }
}

const authenticationToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['auth'];
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Access Denied!" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as CustomJWTPayload;
        req.userId = decoded.userId;
        req.user = { id: req.userId, isAdmin: decoded.isAdmin };
        next(); 
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(StatusCodes.UNAUTHORIZED).json({ message:"Access Denied!"});
    }
};


export default authenticationToken;