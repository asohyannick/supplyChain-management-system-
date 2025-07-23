import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import DronePickUp from "../../../models/dronePickUp/dronePickUp.model";
import { DroneStatus } from "../../../serviceImplementators/dronelPickUp/dronePickUp.interfac";
const updateDronePickUp = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {
            distance,
            location,
            address,
            notes,
            packageDetails,
            batteryLevel,
        } = req.body;
        const { id } = req.params;
        const pickup = await DronePickUp.findByIdAndUpdate(id, {
            distance,
            location,
            status: DroneStatus.AVAILABLE,
            pickupTime: Date.now(),
            address,
            notes,
            packageDetails,
            batteryLevel,
        }, { new: true, runValidators: true });
        if (!pickup) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Pickup doesn't exist!",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Your drone pickup has been updated successfully",
            pickup,
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

export default updateDronePickUp;