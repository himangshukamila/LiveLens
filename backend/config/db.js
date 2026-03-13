
// import mongoose from "mongoose";

// export async function connectDB(mongoUri) {
//   if (!mongoUri) throw new Error("MONGO_URI is required");
//   return mongoose.connect(mongoUri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });
// }


import mongoose from "mongoose";

export async function connectDB(uri) {
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}