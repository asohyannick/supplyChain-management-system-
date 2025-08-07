import { IUser } from "../user/user.interfac";
declare global {
    namespace Express {
        interface Request {
            user?: IUser; 
        }
    }
}