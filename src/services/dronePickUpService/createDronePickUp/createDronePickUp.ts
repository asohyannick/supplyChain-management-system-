import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import DronePickUp from "../../../models/dronePickUp/dronePickUp.model";
import { DroneStatus } from "../../../serviceImplementators/dronelPickUp/dronePickUp.interfac";
const createDronePickUp = async (req: Request, res: Response): Promise<Response> => {
    const {
        distance,
        location,
        address,
        notes,
        packageDetails,
        batteryLevel,
    } = req.body;

    try {
        const newDronePickUp = new DronePickUp({
            pickupTime: Date.now(),
            distance,
            location,
            status:DroneStatus.AVAILABLE,
            address,
            notes,
            packageDetails,
            batteryLevel,
        });
        await newDronePickUp.save();
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Your drone pickup request has been successfully created.",
            pickupDetails: newDronePickUp,
        });
    } catch (error) {
        console.error("An error occurred while creating the pickup:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "We encountered an error while processing your request. Please try again later.",
            error: error instanceof Error ? error.message : "An unexpected error occurred.",
        });
    }
};

export default createDronePickUp;