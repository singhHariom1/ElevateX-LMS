import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MongoDB URI is not defined in environment variables");
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
export default connectDB;
