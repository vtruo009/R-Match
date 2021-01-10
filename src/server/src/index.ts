import './preStart';
import './postStart';
import app, { clientPath } from '@server';
import logger from '@shared/Logger';
import socketio from 'socket.io';

// Start the server
const port = Number(process.env.PORT || 5000);
const server = app.listen(port, () => {
    logger.info('Server started on port: ' + port);
});

// Socket setup
// When I use 5000 instead of 6000, I get an error saying something like
// "5000 is already in use".
const io = new socketio.Server(server, {
    cors: {
        origin: clientPath,
        credentials: true,
    },
});
io.on('connection', (socket: any) => {
    // This message should appear console log whenever a client
    // accesses the website the message page on the website.
    console.log('Connected with socket!!');
});
