import { connect } from "mongoose";

const connectDB = async () => {
  try {
    const mongoDBUrl = process.env.MONGO_URL || "";
    await connect(mongoDBUrl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

export default connectDB;