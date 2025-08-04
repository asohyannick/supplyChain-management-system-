import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DroneStatus } from "../../../enums/drone/drone.constants";
import Drone from "../../../models/drone/drone.model";
import app from "../../../server";
import http from 'http';
import { WebSocketServer } from 'ws';
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const updateDroneService = async (req: Request, res: Response): Promise<Response> => {
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
        const updatedDrone = await Drone.findByIdAndUpdate(id, {
            distance,
            location,
            status: DroneStatus.AVAILABLE,
            pickupTime: Date.now(),
            address,
            notes,
            packageDetails,
            batteryLevel,
        }, { new: true, runValidators: true });
        wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(updatedDrone));
        }});
        if (!updatedDrone) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Drone doesn't exist!",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Your drone pickup service has been updated successfully",
            drone: updatedDrone,
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

export default updateDroneService;