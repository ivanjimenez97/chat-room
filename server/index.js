//Root Directory/server/index.js
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./db.js";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
//Imports for file uploads
import multer from "multer";
import Message from "../models/Message.js";

dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;
connectDB();
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

// Add CORS middleware
app.use(cors());

// this line to parse JSON requests
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

//Upload Image and send a message
app.post("/upload", upload.single("image"), async (req, res) => {
  const { userId, username, time } = req.body;

  const newMessage = new Message({
    userId,
    username,
    image: req.file.buffer,
    time,
  });

  try {
    await newMessage.save();
    //Sending message to the rest of users (Except the current user).
    io.emit("message", newMessage);
    res.status(200).send("Image uploaded successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error uploading image");
  }
});

//Send a message
app.post("/message", async (req, res) => {
  const { userId, username, body, time } = req.body;

  const newMessage = new Message({
    userId,
    username,
    body,
    time,
  });

  try {
    await newMessage.save();
    //Sending message to the rest of users (Except the current user).
    io.emit("message", newMessage);
    res.status(200).send("Message sent successfully");
  } catch (error) {
    res.status(500).send("Error sending message");
    console.log(error);
  }
});

//Serve images from mongodb as binary data
app.get("/image/:id", async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message || !message.image) {
      return res.status(404).send("Image not found");
    }
    res.contentType("image/png");
    res.send(message.image);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching image");
  }
});

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

  socket.on("disconnect", () => {
    io.emit("notification", "A user left the chat.");
  });
});

server.listen(PORT, () => {
  console.log(`Server on Port: ${PORT}`);
});
