import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";

dotenv.config();
const PORT = process.env.SERVER_PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

io.on("connection", (socket) => {
  console.log("A User connected");
  //Receiving Message
  socket.on("message", (data) => {
    console.log(data);
    //updating object to add an user typ:
    const newData = {
      ...data,
      userType: socket.id.slice(6),
    };
    //Sending message to the rest of users.
    socket.broadcast.emit("message", newData);
  });
});

server.listen(PORT);

console.log(`Server on Port: ${PORT}`);
