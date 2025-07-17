import { createLogger, format, transports } from 'winston';
const logger = createLogger({
    level:process.env.LOG_LEVEL as string || 'info',
    format: format.combine(
        format.timestamp(),
        format.json(),
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'app.log' }),
    ],
});
export default logger;