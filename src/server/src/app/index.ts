import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import passport from 'passport';
import 'express-async-errors';
import BaseRouter from '@routes/index';
import logger from '@shared/Logger';
import cors from 'cors';
import '@lib/passportSetup';

const app = express();
const { BAD_REQUEST } = StatusCodes;

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

export const clientPath =
    process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: clientPath,
    })
);
app.use(passport.initialize());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
// if (process.env.NODE_ENV === 'production') {
//     app.use(helmet());
// }

if (process.env.NODE_ENV === 'test') {
    app.get('/', (req, res) => res.sendStatus(200));
}

// logger.info()
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../build')));
}

// Add APIs
app.use('/api', BaseRouter);

if (process.env.NODE_ENV === 'production') {
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname + '../../../build/index.html'));
    });
}

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
