import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import passport from 'passport';
import 'express-async-errors';
import { createConnection } from 'typeorm';
import BaseRouter from './routes';
import logger from '@shared/Logger';
import cors from 'cors';
import 'src/lib/passportSetup';
const app = express();
const { BAD_REQUEST } = StatusCodes;

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

/************************************************************************************
 *                              PostgresQL connection
 ***********************************************************************************/

const connectToDb = async () => {
    try {
        await createConnection();
        logger.info('PostgresQL database connection established successfully');
    } catch (error) {
        logger.err('PostgresQL database connection was not established');
    }
};

(async () => {
    await connectToDb();
})();

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/api', BaseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});

// Export express instance
export default app;
