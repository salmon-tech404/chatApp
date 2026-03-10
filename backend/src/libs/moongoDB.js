import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const cont = await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("MongoDB connected: ", cont.connection.host);
  } catch (error) {
    console.log("MongoDB connection error: ", error.message);
  }
};
