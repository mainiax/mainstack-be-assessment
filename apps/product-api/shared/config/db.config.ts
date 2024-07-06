import mongoose from "mongoose";

const uri: string = process.env.MONGO_URI || "mongodb://localhost:27017";

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || "product-db",
    });
  } catch (error) {
    throw error;
  }
};

export default connectDB;
