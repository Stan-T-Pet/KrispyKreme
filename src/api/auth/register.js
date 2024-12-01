import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, pass, confirmEmail, confirmPass } = req.body;

  if (!email || !pass || !confirmEmail || !confirmPass) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (email !== confirmEmail) {
    return res.status(400).json({ message: "Emails do not match" });
  }

  if (pass !== confirmPass) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();

  const db = client.db("myDatabase");
  const collection = db.collection("users");

  const existingUser = await collection.findOne({ email });
  if (existingUser) {
    await client.close();
    return res.status(409).json({ message: "User already exists" });
  }

  const user = {
    email,
    password: pass,
    createdAt: new Date(),
  };

  await collection.insertOne(user);
  await client.close();

  return res.status(201).json({ message: "User registered successfully" });
}