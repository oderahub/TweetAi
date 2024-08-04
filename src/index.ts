import express from "express";
import http from "http"; // Import http to create server
import { Server as SocketIOServer } from "socket.io"; // Import Socket.IO
import AppDataSource from "./ormconfig";
import { AutobotService } from "./services/AutobotService";
import rateLimiter from "./middlewares/rateLimiter";
import swaggerDocs from "./swagger";
import cron from "node-cron";
import { Logger } from "./utils/logger";
import autobotsRoutes from "./controllers/autobotController";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;
const autobotService = new AutobotService();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new SocketIOServer(server);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.VUE_APP_API_URL, // Vue app URL
  })
);

// Swagger setup - API documentation
swaggerDocs(app);

// Routes that should bypass rate limiter
app.use("/api", autobotsRoutes);
app.get("/test-create-autobots", async (req, res) => {
  try {
    await autobotService.createAutobots();
    res.send("Autobots created successfully");
  } catch (error) {
    res.status(500).send("Error in creating Autobots");
  }
});

// Apply rate limiter middleware after setting up routes
app.use(rateLimiter);

// Start the cron job
cron.schedule("* * * * *", () => {
  Logger.info("Cron job started");
  autobotService
    .createAutobots()
    .then(() => Logger.info("Autobot creation process completed"))
    .catch((err) => Logger.error("Error in autobot creation", err));
});

// Set up WebSocket connection
io.on("connection", (socket) => {
  Logger.info("A user connected");

  // Emit autobots update to clients
  const emitAutobots = async () => {
    try {
      const autobots = await autobotService.getAllAutobots();
      socket.emit("autobots:update", autobots);
    } catch (error) {
      Logger.error("Error fetching autobots", error);
    }
  };

  // Call emitAutobots when the connection is established
  emitAutobots();

  // Handle disconnection
  socket.on("disconnect", () => {
    Logger.info("User disconnected");
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

export default app;
