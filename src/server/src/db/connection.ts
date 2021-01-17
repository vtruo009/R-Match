import { createConnection, getConnection, getConnectionOptions } from 'typeorm';
import logger from '@shared/Logger';

/************************************************************************************
 *                              Creates connection
 ***********************************************************************************/

export const connectToDb = async () => {
    try {
        const connectionOptions = await getConnectionOptions(
            process.env.NODE_ENV
        );
        const connection = await createConnection({
            ...connectionOptions,
            name: 'default',
        });
        await connection.synchronize();
        await connection.runMigrations();
        logger.info('PostgreSQL database connection established successfully');
    } catch (error) {
        logger.err('PostgreSQL database connection was not established');
        logger.err(error);
    }
};

/************************************************************************************
 *                              Closes connection
 ***********************************************************************************/

export const disconnectFromDb = async () => {
    try {
        await getConnection().close();
    } catch (error) {
        logger.err(error);
    }
};
