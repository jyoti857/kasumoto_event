import mongoose from 'mongoose'


const MONGODB_URI = process.env.MONGODB_URI
let cached = (global as any).mongoose || {conn: null, promise: null}

export const connectToDatabase = async() => {
  console.log("connect to db", MONGODB_URI)
  if(cached.conn) return cached.conn
  if(!MONGODB_URI) throw new Error("Mongodb uri is missing!");
  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: "kasumoto",
    bufferCommands: false
  })
}