import { StatusCodes } from "http-status-codes";
import admin from "./firebaseAuth";
import { Request, Response, } from "express";
const firebaseLogin = async (req: Request, res: Response) => {
    const { idToken } = req.body;
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        return res.status(StatusCodes.OK).json({
            success: true,
            uid,
            email: decodedToken.email,
            message:"User login has been done successfully!",
        });
    } catch (error) {
        console.error("Error occured!", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Something went wrong!",
            error: error instanceof Error ? error.message : "Unknown Error Message",
        });
    }
}

export default firebaseLogin;