import { Request, Response, NextFunction } from "express";
import { UserStatus } from "../../enums/user/user.constants";
const authorizeRoles = (...allowedRoles: UserStatus[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user; 
        console.log("User:", req.user); // Log the user object
        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: "Access forbidden: insufficient permissions" });
        }
        next();
    };
};
export default authorizeRoles;