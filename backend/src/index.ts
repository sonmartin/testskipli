import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import accessCodeRoute from "./routes/accessCode";
import instructorRoutes from "./routes/instructor";
import studentRoutes from "./routes/student";
import messagesRoute from "./routes/message";
import { registerSocketHandlers } from "./socket/sockethandler";

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(bodyParser.json());

app.use("/api", accessCodeRoute);
app.use("/api", instructorRoutes);
app.use("/api", studentRoutes);
app.use("/api", messagesRoute);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

registerSocketHandlers(io);

const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
