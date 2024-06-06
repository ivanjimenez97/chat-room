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

//Image Verification Method
const isImage = (mimetype) => {
  const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
  return validImageTypes.includes(mimetype);
};

//Upload Image and send a message
app.post("/upload/image", upload.single("image"), async (req, res) => {
  const { userId, username, time } = req.body;

  if (!isImage(req.file.mimetype)) {
    return res.status(400).send("Invalid image type.");
  }

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

//Upload File and Send a Message
app.post("/upload/file", upload.single("file"), async (req, res) => {
  const { userId, username, time } = req.body;

  const newMessage = new Message({
    userId,
    username,
    file: {
      name: req.file.originalname,
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
    time,
  });

  try {
    await newMessage.save();
    io.emit("message", newMessage);
    res.status(200).send("File uploaded successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error uploading file");
  }
});

//Serve files from mongodb as binary data
app.get("/file/:id", async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message || !message.file) {
      return res.status(404).send("File not found");
    }

    // Set headers
    res.set("Content-Type", message.file.mimetype);
    res.set("Content-Disposition", `inline; filename="${message.file.name}"`);

    res.send(message.file.buffer);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching file");
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

// Search messages by content or username
app.get("/search/messages", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).send("Query parameter is required");
  }

  try {
    // Find messages that match the query in the body or username
    const messages = await Message.find({
      $or: [
        { body: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).sort({ time: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error searching messages");
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
