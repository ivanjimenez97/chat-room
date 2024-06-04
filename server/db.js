import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost/chatroomdb");
  } catch (error) {
    console.log(error);
  }
};
