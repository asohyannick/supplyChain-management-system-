import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DroneStatus } from "../../../serviceImplementators/drone/drone.interfac";
import Drone from "../../../models/drone/drone.model";
const createDroneService = async (req: Request, res: Response): Promise<Response> => {
    const {
        distance,
        location,
        address,
        notes,
        packageDetails,
        batteryLevel,
    } = req.body;

    try {
        const newDrone = new Drone({
            pickupTime: Date.now(),
            distance,
            location,
            status:DroneStatus.AVAILABLE,
            address,
            notes,
            packageDetails,
            batteryLevel,
        });
        await newDrone.save();
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Your drone pickup request has been created successfully",
            droneDetails: newDrone,
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

export default createDroneService;