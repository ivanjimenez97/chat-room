// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  body: { type: String, required: false },
  image: { type: Buffer, required: false },
  time: { type: String, required: true },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
