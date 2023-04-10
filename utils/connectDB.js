import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const localUri = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(localUri);
    console.log('Database connected successfully');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

export default connectDB;