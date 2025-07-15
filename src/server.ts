import 'dotenv/config';
import express, { Application } from 'express';
import morgan from 'morgan';
import databaseConfiguration from './config/databaseConfig/databaseConfig';
import { setupSwagger } from './config/swaggerUI/swaggerUI';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import notFoundRouteHandler from './middleware/customExceptions/notFound/notFoundRouteHandler';
import serverSideError from './middleware/customExceptions/serverError/serverSideErrorHandler';
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const APP_NAME = process.env.APP_NAME as string || 'AirMailGoBackendAPI';
const APP_HOST = process.env.APP_HOST as string || 'http://localhost';
const API_VERSION: string | number = process.env.API_VERSION || 'v1';
const APP_PORT: string | number = parseInt(process.env.APP_PORT || '8080', 10);
if (process.env.NODE_ENV as string === 'development') {
    app.use(morgan('dev'));
}
setupSwagger(app);
app.use(cors({
    origin: process.env.FRONTEND_DOMAIN as string,
    credentials: true,
}));
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
})
app.use(limiter);
app.use(helmet());
app.use(compression());
app.use(notFoundRouteHandler);
app.use(serverSideError);
const serve = async () => {
    try {
        await databaseConfiguration(),
            app.listen(APP_PORT, () => {
                console.log(`Server is called ${APP_NAME}
                running on ${APP_HOST}
                on /api/ ${API_VERSION}
                on port: ${APP_PORT}...`
                )
            })
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
serve();
