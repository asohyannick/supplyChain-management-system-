import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express, { Application } from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import morgan from 'morgan';
import logger from './config/logger/logger';
import databaseConfiguration from './config/databaseConfig/databaseConfig';
import Drone from './models/drone/drone.model';
import { IDrone } from './serviceImplementators/drone/drone.interfac';
import { getMockDroneData } from './utils/mockDroneData';
import { setupSwagger } from './config/swaggerUI/swaggerUI';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import userRoute from './controllers/user/user.controller';
import profileRoute from './controllers/profile/profile.controller';
import droneRoute from './controllers/drone/drone.controller';
import stripePaymentRoute from './controllers/payment/payment.controller';
import paypalPaymentRoute from './controllers/paypal/paypal.controller';
import blockChainDeliveryRoute from './controllers/blockChainDelivery/blockChainDelivery.controller';
import subscriptionRoute from './controllers/subscription/subscription.controller';
import notFoundRouteHandler from './middleware/customExceptions/notFound/notFoundRouteHandler';
import serverSideError from './middleware/customExceptions/serverError/serverSideErrorHandler';
const app: Application = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);
const initWebSocketServer = () => {
    wss.on('connection', (ws) => {
        console.log('New client connected successfully');
        ws.on('message', (message) => {
            console.log("Received:", message);
            const droneData = JSON.parse(message.toString());
            saveDroneData(droneData);
        });
        // Send initial drone data to the new client
        Drone.find().then((drones) => ws.send(JSON.stringify(drones)));

        setInterval(() => {
            const droneData = getMockDroneData();
            ws.send(JSON.stringify(droneData));
        }, 1000);
    });
};
async function saveDroneData(data: IDrone) {
    const drone = new Drone(data);
    await drone.save();
}
// Environment variable configurations
const {
    APP_NAME = 'AirMailGoBackend',
    APP_HOST = 'http://localhost',
    API_VERSION = 'v1',
    APP_PORT = '8080',
    FRONTEND_DOMAIN,
    NODE_ENV,
} = process.env;

if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else if (NODE_ENV === 'production') {
    app.use(morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    }));
}
// CORS setUp
app.use(cors({
    origin: FRONTEND_DOMAIN,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
}));
// Rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
});
app.use(limiter);
app.use(helmet());
app.use(compression());
// API Routes
app.use(`/api/${API_VERSION}/user`, userRoute);
app.use(`/api/${API_VERSION}/profile`, profileRoute);
app.use(`/api/${API_VERSION}/drone`, droneRoute);
app.use(`/api/${API_VERSION}/block-chain`, blockChainDeliveryRoute);
app.use(`/api/${API_VERSION}/stripe-payment`, stripePaymentRoute);
app.use(`/api/${API_VERSION}/paypal-payment`, paypalPaymentRoute);
app.use(`/api/${API_VERSION}/subscription`, subscriptionRoute);
app.use(notFoundRouteHandler);
app.use(serverSideError);
// This function initializes the database and starts the server
const startServer = async () => {
    try {
        await databaseConfiguration(),
            app.listen(APP_PORT, () => {
                console.log(`Server is called ${APP_NAME}
                running on ${APP_HOST}
                on /api/ ${API_VERSION}
                on port: ${APP_PORT}...`
                );
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
// Initializing the WebSocket server and starting the main server
initWebSocketServer();
startServer();
export default app;
