import { createConnection } from 'typeorm';
import { seedData } from '@db/seed';
import logger from '@shared/Logger';

/************************************************************************************
 *                              PostgresQL connection
 ***********************************************************************************/

const connectToDb = async () => {
    try {
        await createConnection();
        logger.info('PostgreSQL database connection established successfully');
    } catch (error) {
        logger.err('PostgreSQL database connection was not established');
        logger.err(error);
    }
};

/************************************************************************************
 *                              Database initial data entry
 ***********************************************************************************/

const seedDb = async () => {
    try {
        await seedData();
        logger.info('Post start data successfully saved in the database');
    } catch (error) {
        logger.err('Post start data could not be saved in the database');
        logger.err(error);
    }
};

(async () => {
    await connectToDb();
    await seedDb();
})();
