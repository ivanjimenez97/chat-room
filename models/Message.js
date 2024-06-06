// models/Message.js
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  buffer: { type: Buffer, required: true },
  mimetype: { type: String, required: true },
  size: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        // Max file size: 10MB (10485760 bytes)
        return v <= 10485760;
      },
      message: (props) =>
        `File size (${props.value} bytes) exceeds the limit of 10MB!`,
    },
  },
});

const messageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  body: { type: String, required: false },
  image: { type: Buffer, required: false },
  file: { type: fileSchema, required: false },
  time: { type: String, required: true },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
