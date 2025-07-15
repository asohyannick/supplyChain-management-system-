import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AnySchema } from "yup";
const globalValidator = (schema: AnySchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validate(req.body, { abortEarly: false });
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                errors: error
            });
        }
    }
}

export default globalValidator;