import { createConnection, getConnection, getConnectionOptions } from 'typeorm';
import logger from '@shared/Logger';

/************************************************************************************
 *                              Creates connection
 ***********************************************************************************/

const createDbConnection = async () => {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    return process.env.NODE_ENV === 'production'
        ? createConnection({
              ...connectionOptions,
              url: process.env.DATABASE_URL,
              name: 'default',
          } as any)
        : createConnection({
              ...connectionOptions,
              name: 'default',
          });
};

/************************************************************************************
 *                              Connects to database
 ***********************************************************************************/
export const connectToDb = async () => {
    try {
        const connection = await createDbConnection();
        if (!connection) throw new Error('Connection created as null');
        // TODO: Is it really need to synchronize in production?
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
