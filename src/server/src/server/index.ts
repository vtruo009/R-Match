import '@dotenv/config';
import { connectToDb } from '@db/connection';
import app from 'src/app';
import logger from '@shared/Logger';
import socketio from 'socket.io'
import { Message } from '@entities/message';

// Initializes database
(async () => {
    await connectToDb();
})();

// Start the server
const port = Number(process.env.PORT || 5000);
const server = app.listen(port, () => {
    logger.info('Server started on port: ' + port);
});

const clientPath = 'http://localhost:3000';

// Socket setup
const io = new socketio.Server(server, {
    cors: {
        origin: clientPath,
        credentials: true,
    },
});

io.on('connection', (socket: any) => {
    socket.on('chat', (message: Message) => {
        io.sockets.emit('chat', message);
    });
});