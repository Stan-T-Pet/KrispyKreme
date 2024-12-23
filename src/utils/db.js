import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri); // No deprecated options needed
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri); // No deprecated options needed
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const connectedClient = await clientPromise;
  return { db: connectedClient.db(process.env.MONGODB_DB) };
}