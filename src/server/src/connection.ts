import { createConnection, getConnection } from 'typeorm';
import { seedData } from '@db/seed';
import logger from '@shared/Logger';

/************************************************************************************
 *                              Creates connection
 ***********************************************************************************/

export const connectToDb = async () => {
    try {
        await createConnection();
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
    entities.forEach(async (entity) => {
        const repository = connection.getRepository(entity.name);
        await repository.query(`DELETE FROM ${entity.tableName}`);
    });
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
