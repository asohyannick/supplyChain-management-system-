import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const notFoundRouteHandler = (_req: Request, res: Response) => {
    const notFoundRouteMsg: string = "Route doesn't exist!";
    return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: notFoundRouteMsg,
        status: StatusCodes.NOT_FOUND,
    });
}
export default notFoundRouteHandler;