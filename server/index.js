import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./db.js";
import http from "http";
import { Server as SocketServer } from "socket.io";
import Message from "../models/Message.js";

dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;
connectDB();
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

io.on("connection", (socket) => {
  console.log("New User connected.");

  // Send existing chat history to the new user
  Message.find()
    .sort({ time: 1 })
    .limit(50)
    .then((messages) => {
      socket.emit("chat history", messages);
    })
    .catch((error) => {
      console.log(error);
    });

  //Welcome current user
  socket.emit("notification", "A user has joined");

  //Receiving data (about the message)
  socket.on("message", (data) => {
    console.log(data);
    //updating object to add an user typ:
    const newMessage = new Message({
      userType: data.userType,
      username: data.username,
      body: data.body,
      time: data.time,
    });

    newMessage
      .save()
      .then(() => {
        //Sending message to the rest of users (Except the current user).
        socket.broadcast.emit("message", newMessage);
      })
      .catch((error) => console.log(error));
  });

  socket.on("disconnect", () => {
    io.emit("notification", "A user left the chat.");
  });
});

server.listen(PORT, () => {
  console.log(`Server on Port: ${PORT}`);
});
