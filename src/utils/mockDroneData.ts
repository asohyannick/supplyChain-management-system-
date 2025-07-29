import { Types } from "mongoose";
import { DroneStatus, IDrone } from '../serviceImplementators/drone/drone.interfac';
import Drone from "../models/drone/drone.model";
export const getMockDroneData = async (): Promise<IDrone> => {
    const droneData: IDrone = new Drone({
        userId: new Types.ObjectId(),
        droneId: 'drone1', 
        pickupTime: new Date(), 
        distance: Math.random() * 100,
        location: {
            latitude: parseFloat((Math.random() * 90).toFixed(6)), 
            longitude: parseFloat((Math.random() * 180).toFixed(6)), 
        },
        status: DroneStatus.AVAILABLE,
        address: {
            street: '123 Example St',
            city: 'Sample City',
            state: 'CA',
            zipCode: '90210',
            country: 'USA',
        },
        notes: 'Deliver to the main entrance.',
        packageDetails: [{
            weight: Math.random() * 10,
            dimensions: {
                length: Math.random() * 10,
                width: Math.random() * 10,
                height: Math.random() * 10,
            },
            description: 'Sample package',
        }],
        batteryLevel: Math.floor(Math.random() * 101), 
    });

    return droneData;
};