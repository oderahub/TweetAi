import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import AppDataSource from './ormconfig';
import { autobotQueue } from './bullConfig'; // Import queue
import rateLimiter from './middlewares/rateLimiter';
import swaggerDocs from './swagger';
import cron from 'node-cron';
import { Logger } from './utils/logger';
import autobotsRoutes from './controllers/autobotController';
import cors from 'cors';
import dotenv from 'dotenv';
import autobotService from './services/AutobotService';
import './jobs'; // Initialize job processor

dotenv.config();

const app = express();
const port = 3000;

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type'],
  },
});

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type'],
  })
);

// Swagger setup - API documentation
swaggerDocs(app);

app.use('/api', autobotsRoutes);
app.get('/test-create-autobots', async (req, res) => {
  try {
    // Add a job to the queue instead of processing it directly
    autobotQueue.add({});
    res.send('Autobot creation job added to the queue');
  } catch (error) {
    res.status(500).send('Error in creating Autobots');
  }
});

app.use(rateLimiter);



// Set up WebSocket connection
io.on('connection', (socket) => {
  Logger.info('A user connected');

  // Emit autobots update to clients
  const emitAutobots = async () => {
    try {
      const autobots = await autobotService.getAllAutobots(10, 0); // Fetch only a limited number of autobots
      socket.emit('autobots:update', autobots);
    } catch (error) {
      Logger.error('Error fetching autobots', error);
    }
  };

  // Call emitAutobots when the connection is established
  emitAutobots();

  // Handle disconnection
  socket.on('disconnect', () => {
    Logger.info('User disconnected');
  });
});

// Database connection and server start
AppDataSource.initialize()
  .then(() => {
    server.listen(port, () => {
      Logger.info(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => Logger.error(error));

// Schedule a cron job to add autobot creation job to the queue every minute
cron.schedule('* * * * *', () => {
  Logger.info('Cron job started');
  autobotQueue.add({});
});
export default app;
