import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import fetchWeatherData from '../../../utils/fetchWeatherData';
import Drone from '../../../models/drone/drone.model';
const droneWeatherMapOptimization = async (req: Request, res: Response) => {
    const { start, end } = req.body; 
    try {
        const noFlyZones = await Drone.find(); 
        const startWeather = await fetchWeatherData(start.latitude, start.longitude);
        const endWeather = await fetchWeatherData(end.latitude, end.longitude);
        const optimizedRoute = optimizeRoute(start, end, noFlyZones, startWeather, endWeather);
        return res.status(StatusCodes.OK).json({
            success: true,
            optimizedRoute,
        });
    } catch (error) {
        console.error("Error in droneWeatherMap:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An error occurred while processing the request.",
        });
    }
};

// Route optimization logic
const optimizeRoute = (start: { latitude: number; longitude: number },
    end: { latitude: number; longitude: number }, noFlyZones: any[], startWeather: any, endWeather: any) => {

    const isInNoFlyZone = (lat: number, lng: number) => {
        return noFlyZones.some(zone => {
            return zone.coordinates.some((coord: [number, number]) => {
                return lat === coord[0] && lng === coord[1];
            });
        });
    };

    if (isInNoFlyZone(start.latitude, start.longitude) || isInNoFlyZone(end.latitude, end.longitude)) {
        throw new Error('Start or end location is within a no-fly zone.');
    }
    if (startWeather.weather[0].main === 'Rain' || endWeather.weather[0].main === 'Rain') {
        console.warn('Weather conditions may affect the route.');
    }
    return [
        { latitude: start.latitude, longitude: start.longitude },
        { latitude: (start.latitude + end.latitude) / 2, longitude: (start.longitude + end.longitude) / 2 },
        { latitude: end.latitude, longitude: end.longitude },
    ];
};

export default droneWeatherMapOptimization;