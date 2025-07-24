import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express, { Application } from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import morgan from 'morgan';
import logger from './config/logger/logger';
import databaseConfiguration from './config/databaseConfig/databaseConfig';
import DronePickUp from './models/dronePickUp/dronePickUp.model';
import { setupSwagger } from './config/swaggerUI/swaggerUI';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import userRoute from './controllers/user/user.controller';
import dronePickUpRoute from './controllers/dronePickUp/dronePickUp.controller'
import notFoundRouteHandler from './middleware/customExceptions/notFound/notFoundRouteHandler';
import serverSideError from './middleware/customExceptions/serverError/serverSideErrorHandler';
import { IDronePickUp } from './serviceImplementators/dronelPickUp/dronePickUp.interfac';
import { getMockDroneData } from './utils/mockDroneData';
const app: Application = express();
app.use(cookieParser());
app.use(express.json());
setupSwagger(app);
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const wss = new WebSocketServer({server});
const initWebSocketServer = () => {
    wss.on('connection', (ws) => {
        console.log('New client connected');
        ws.on('message', (message) => {
            const droneData = JSON.parse(message.toString());
            saveDroneData(droneData);
        });

        setInterval(() => {
            const droneData = getMockDroneData();
            ws.send(JSON.stringify(droneData));
        }, 1000);
    });
};
async function saveDroneData(data: IDronePickUp) {
    const dronePickUp = new DronePickUp(data);
    await dronePickUp.save();
}
const APP_NAME = process.env.APP_NAME as string || 'AirMailGoBackend';
const APP_HOST = process.env.APP_HOST as string || 'http://localhost';
const API_VERSION: string | number = process.env.API_VERSION || 'v1';
const APP_PORT: string | number = parseInt(process.env.APP_PORT || '8080', 10);
if (process.env.NODE_ENV as string === 'development') {
    app.use(morgan('dev'));
} else if (process.env.NODE_ENV as string === 'production') {
    app.use(morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    }));
}
app.use(cors({
    origin: process.env.FRONTEND_DOMAIN as string,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
}));
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
});
app.use(limiter);
app.use(helmet());
app.use(compression());
app.use(`/api/${API_VERSION}/user`, userRoute);
app.use(`/api/${API_VERSION}/drone-pickup`, dronePickUpRoute);
app.use(notFoundRouteHandler);
app.use(serverSideError);
const startServer = async () => {
    try {
        await databaseConfiguration(),
            app.listen(APP_PORT, () => {
                console.log(`Server is called ${APP_NAME}
                running on ${APP_HOST}
                on /api/ ${API_VERSION}
                on port: ${APP_PORT}...`
                )
            });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error occured!:', {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
        } else {
            console.error('Error occured!', {
                error,
                timestamp: new Date().toISOString(),
            });
        }
    }
}
initWebSocketServer();
startServer();
export default app;
