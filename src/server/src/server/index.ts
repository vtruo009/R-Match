import '@dotenv/config';
import { connectToDb } from '@db/connection';
import app from 'src/app';
import logger from '@shared/Logger';

// Initializes database
(async () => {
    await connectToDb();
})();

// Start the server
const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
    logger.info('Server started on port: ' + port);
});
