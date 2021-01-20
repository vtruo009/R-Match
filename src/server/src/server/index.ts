import '@dotenv/config';
import { connectToDb } from '@db/connection';
import app from 'src/app';
import logger from '@shared/Logger';
import socketio from 'socket.io'
import { Message } from '@entities/message';
import { clientPath } from 'src/app';

// Initializes database
(async () => {
    await connectToDb();
})();

// Start the server
const port = Number(process.env.PORT || 5000);
const server = app.listen(port, () => {
    logger.info('Server started on port: ' + port);
});

// Socket setup
const io = new socketio.Server(server, {
    cors: {
        origin: clientPath,
        credentials: true,
    },
});

io.on('connection', (socket: any) => {
    socket.on('new_message', (message: Message) => {
        // Populate date field here because Date object cannot be created
        // in client side.
        message.date = new Date();
        io.sockets.emit('message_area', message);
        io.sockets.emit('update_conversation', message);
    });
});