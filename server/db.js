import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connection Stablieshed with mongodb");
  } catch (error) {
    console.log(error);
  }
};
