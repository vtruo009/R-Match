import { createConnection, getConnection, getConnectionOptions } from 'typeorm';
import { seedData } from './seed';
import logger from '@shared/Logger';

/************************************************************************************
 *                              Creates connection
 ***********************************************************************************/

export const connectToDb = async () => {
    try {
        const connectionOptions = await getConnectionOptions(
            process.env.NODE_ENV
        );
        await createConnection({ ...connectionOptions, name: 'default' });
        // await createConnection();
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

/************************************************************************************
 *                              Clears database
 ***********************************************************************************/

export const clearDb = async () => {
    const connection = getConnection();
    const entities = connection.entityMetadatas;
    try {
        for (const entity of entities) {
            const repository = await connection.getRepository(entity.name);
            await repository.query(`DELETE FROM "${entity.tableName}";`);
        }
    } catch (error) {
        logger.err(`ERROR: Cleaning test db: ${error}`);
    }
};

/************************************************************************************
 *                             Seed database
 ***********************************************************************************/

export const seedDb = async () => {
    try {
        await seedData();
        logger.info('Pre start data successfully saved in the database');
    } catch (error) {
        logger.err('Pre start data could not be saved in the database');
        logger.err(error);
    }
};
