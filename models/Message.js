// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userType: { type: String, required: true },
  username: { type: String, required: true },
  body: { type: String, required: true },
  time: { type: String, required: true },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
