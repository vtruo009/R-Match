import './preStart';
import app from 'src/app';
import logger from '@shared/Logger';

// Start the server
const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
    logger.info('Server started on port: ' + port);
});
