import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Explicitly disable retryWrites to prevent "Transaction numbers are only allowed on a replica set member" 
      // error on standalone MongoDB instances (like local dev or simple Docker setups).
      retryWrites: false,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
