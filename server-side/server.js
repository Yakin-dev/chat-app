import "./lib/config.js";
import express from "express";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

//Create Express App and Http server
const app = express();
const server = http.createServer(app);
//initialize socket io server
export const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
//Store Online Users
export const userSocketMap = {}; //{userId:socketId};
//Socket connection handler initialization
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUser", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUser", Object.keys[userSocketMap]);
  });
});

//Middleware Setup
app.use(express.json({ limit: "4mb" }));
app.use(
  cors()
);
//Database Connection
await connectDB();
//Routes setup
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/status", (req, res) => res.send("Server Is Alive"));


const PORT = process.env.PORT;
server.listen(PORT, () => console.log("server listen on " + PORT));


//export for vercel
export default server;