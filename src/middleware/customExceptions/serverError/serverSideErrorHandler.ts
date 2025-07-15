import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const serverSideError = (_req: Request, res: Response) => {
    const serverErrorMsg: string = "This is an internal server error!";
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: serverErrorMsg,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
};
export default serverSideError;